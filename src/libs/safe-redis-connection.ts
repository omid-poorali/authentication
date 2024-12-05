import { createClient, RedisClientType } from "redis";

interface IOnConnectedCallback {
  (redisUrl: string): void;
};

interface SafeRedisConnectionOptions {
  redisUrl: string;
  retryDelayMs?: number
  onStartConnection?: (redisUrl: string) => void;
  onConnectionError?: (error: Error, redisUrl: string) => void;
  onConnectionRetry?: (redisUrl: string) => void;
};

export default class SafeRedisConnection {
  private readonly redisClient: RedisClientType;
  private readonly options: SafeRedisConnectionOptions;
  /** Callback when redis connection is established or re-established */
  private onConnectedCallback?: IOnConnectedCallback;

  /**
   * Internal flag to check if connection established for
   * first time or after a disconnection
   */
  private isConnectedBefore: boolean = false;

  private shouldCloseConnection: boolean = false;

  /** Delay between retrying connecting to Redis */
  private retryDelayMs: number = 2000;

  private connectionTimeout?: NodeJS.Timeout;

  /**
   * Start redis connection
   * @param redisUrl Redis URL
   * @param onConnectedCallback callback to be called when redis connection is successful
   */
  constructor(options: SafeRedisConnectionOptions) {
    this.options = options;

    this.redisClient = createClient({
      url: options.redisUrl,
      socket: {
        reconnectStrategy: false
      }
    });
    this.redisClient.on('error', this.onError);
    this.redisClient.on('ready', this.onConnected);

    if (options.retryDelayMs) {
      this.retryDelayMs = options.retryDelayMs;
    }
  }

  /** Close redis connection */
  public async close() {
    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout);
    }
    this.shouldCloseConnection = true;
    await this.redisClient.disconnect();
  }

  /** Start redis connection */
  public connect(onConnectedCallback: IOnConnectedCallback) {
    this.onConnectedCallback = onConnectedCallback;
    this.startConnection();
  }

  private startConnection = () => {
    if (this.options.onStartConnection) {
      this.options.onStartConnection(this.options.redisUrl);
    }
    this.redisClient.connect().catch(() => { });
  }

  /**
   * Handler called when redis connection is established
   */
  private onConnected = () => {
    this.isConnectedBefore = true;
    this.onConnectedCallback?.(this.options.redisUrl);
  };

  /** Handler called for redis connection errors */
  private onError = () => {
    if (this.options.onConnectionError) {
      const error = new Error(`Could not connect to Redis at ${this.options.redisUrl}`);
      this.options.onConnectionError(error, this.options.redisUrl);
    }

    if (this.isConnectedBefore && !this.shouldCloseConnection) {
      this.connectionTimeout = setTimeout(() => {
        this.startConnection();
        this.connectionTimeout && clearTimeout(this.connectionTimeout);
      }, this.retryDelayMs);
      if (this.options.onConnectionRetry) {
        this.options.onConnectionRetry(this.options.redisUrl);
      }
    }
  };
}
