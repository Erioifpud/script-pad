export const dts = `
/**
 * Extension filters for the file dialog.
 *
 * @since 1.0.0
 */
interface DialogFilter {
    /** Filter name. */
    name: string;
    /**
     * Extensions to filter, without a \`.\` prefix.
     * @example
     * \`\`\`typescript
     * extensions: ['svg', 'png']
     * \`\`\`
     */
    extensions: string[];
}

interface OpenDialogOptions {
  /** The title of the dialog window. */
  title?: string;
  /** The filters of the dialog. */
  filters?: DialogFilter[];
  /** Initial directory or file path. */
  defaultPath?: string;
  /** Whether the dialog allows multiple selection or not. */
  multiple?: boolean;
  /** Whether the dialog is a directory selection or not. */
  directory?: boolean;
  /**
   * If \`directory\` is true, indicates that it will be read recursively later.
   * Defines whether subdirectories will be allowed on the scope or not.
   */
  recursive?: boolean;
}

class FileManager {
  static _read(options: OpenDialogOptions): Promise<string[]>;
  static readFiles(options: Omit<OpenDialogOptions, 'directory' | 'defaultPath' | 'recursive' | 'multiple'>): Promise<string[]>;
  static readDirs(options: Omit<OpenDialogOptions, 'directory' | 'defaultPath' | 'multiple'>): Promise<string[]>;
  static readAsString(path: string): Promise<string>;
  static readAsBuffer(path: string): Promise<Uint8Array>;
  static writeAsString(path: string, content: string, append?: boolean): Promise<void>;
  static writeAsBuffer(path: string, content: Uint8Array, append?: boolean): Promise<void>;
  static deleteFile(path: string): Promise<void>;
  static renameFile(path: string, newName: string): Promise<void>;
  static deleteDir(path: string): Promise<void>;
  static moveFile(path: string, newPath: string): Promise<void>;
  static exists(path: string): Promise<boolean>;
}

// -------- Request --------

declare class Body {
  type: string;
  payload: unknown;
  /** @ignore */
  private constructor();
  /**
   * Creates a new form data body. The form data is an object where each key is the entry name,
   * and the value is either a string or a file object.
   *
   * By default it sets the \`application/x-www-form-urlencoded\` Content-Type header,
   * but you can set it to \`multipart/form-data\` if the Cargo feature \`http-multipart\` is enabled.
   *
   * Note that a file path must be allowed in the \`fs\` allowlist scope.
   *
   * @example
   * \`\`\`typescript
   * import { Body } from "@tauri-apps/api/http"
   * const body = Body.form({
   *   key: 'value',
   *   image: {
   *     file: '/path/to/file', // either a path or an array buffer of the file contents
   *     mime: 'image/jpeg', // optional
   *     fileName: 'image.jpg' // optional
   *   }
   * });
   *
   * // alternatively, use a FormData:
   * const form = new FormData();
   * form.append('key', 'value');
   * form.append('image', file, 'image.png');
   * const formBody = Body.form(form);
   * \`\`\`
   *
   * @param data The body data.
   *
   * @returns The body object ready to be used on the POST and PUT requests.
   */
  static form(data: FormInput): Body;
  /**
   * Creates a new JSON body.
   * @example
   * \`\`\`typescript
   * import { Body } from "@tauri-apps/api/http"
   * Body.json({
   *   registered: true,
   *   name: 'tauri'
   * });
   * \`\`\`
   *
   * @param data The body JSON object.
   *
   * @returns The body object ready to be used on the POST and PUT requests.
   */
  static json(data: Record<any, any>): Body;
  /**
   * Creates a new UTF-8 string body.
   * @example
   * \`\`\`typescript
   * import { Body } from "@tauri-apps/api/http"
   * Body.text('The body content as a string');
   * \`\`\`
   *
   * @param value The body string.
   *
   * @returns The body object ready to be used on the POST and PUT requests.
   */
  static text(value: string): Body;
  /**
   * Creates a new byte array body.
   * @example
   * \`\`\`typescript
   * import { Body } from "@tauri-apps/api/http"
   * Body.bytes(new Uint8Array([1, 2, 3]));
   * \`\`\`
   *
   * @param bytes The body byte array.
   *
   * @returns The body object ready to be used on the POST and PUT requests.
   */
  static bytes(bytes: Iterable<number> | ArrayLike<number> | ArrayBuffer): Body;
}

type HttpVerb = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS' | 'CONNECT' | 'TRACE';

declare enum ResponseType {
  JSON = 1,
  Text = 2,
  Binary = 3
}

interface Duration {
    secs: number;
    nanos: number;
}

/**
 * Options object sent to the backend.
 *
 * @since 1.0.0
 */
interface HttpOptions {
    method: HttpVerb;
    url: string;
    headers?: Record<string, any>;
    query?: Record<string, any>;
    body?: Body;
    timeout?: number | Duration;
    responseType?: ResponseType;
}

type FetchOptions = Omit<HttpOptions, 'url'>;

/**
 * Response object.
 *
 * @since 1.0.0
 * */
declare class Response<T> {
    /** The request URL. */
    url: string;
    /** The response status code. */
    status: number;
    /** A boolean indicating whether the response was successful (status in the range 200–299) or not. */
    ok: boolean;
    /** The response headers. */
    headers: Record<string, string>;
    /** The response raw headers. */
    rawHeaders: Record<string, string[]>;
    /** The response data. */
    data: T;
}

class HTTP {
  static raw(url: string, options: FetchOptions): Promise<Response>;
  static get(url: string, options?: Omit<FetchOptions, 'method'>): Promise<Response>;
  static post(url: string, options?: Omit<FetchOptions, 'method'>): Promise<Response>;
}

// -------- AI --------

interface CommonMessage {
  role: string
  content: string
}

type Message = CommonMessage

interface Choice {
  message: Message
  finish_reason: string
}

interface QwenOptions {
  model: string
  input: {
    prompt?: string
    messages?: Message[]
  }
  parameters?: {
    result_format?: string
    seed?: number
    max_tokens?: number
    top_p?: number
    top_k?: number
    repetition_penalty?: number
    temperature?: number
    stop?: string | string[]
    enable_search?: boolean
    incremental_output?: boolean
    // tools?: any
  }
}

interface QwenResponse {
  output: {
    text: string
    finish_reason: string
    choices: Choice[]
  }
  usage: {
    output_tokens: number
    input_tokens: number
    total_tokens: number
  }
  request_id: string
}

interface QwenChatRawOptions {
  model: string
  messages: Message[]
  key: string
}

interface QwenChatOptions {
  model: string
  question: string
  key: string
}

class AI {
  static async qwenChatRaw(options: QwenChatRawOptions): Promise<QwenResponse>;
  static async qwenChatSimple(options: QwenChatOptions): Promise<string>;
  static async qwenChat(options: QwenChatRawOptions): Promise<string>;
}

// -------- Config --------

class Config {
  static async get(key: string): Promise<any>;
  static async keys(): Promise<string[]>;
  static async values(): Promise<any[]>;
}

// -------- HTML --------

class HTML {
  static async getPlainText(html: string): Promise<string>;
}

// -------- App --------

class App {
  static async showText(text: string): Promise<void>;
  static async showComponent(node: any, style: string, wrapperStyle: Record<string, any>): Promise<void>;
  static async showRawComponent(node: any): Promise<void>;
  static async start(): Promise<void>;
  static async done(): Promise<void>;
}

// -------- Input --------

interface BaseNode<T> {
  id: string
  value: T
  placeholder: string
}

interface TextNode extends BaseNode<string> {
  type: 'text'
}

interface AreaNode extends BaseNode<string> {
  type: 'area'
}

interface SelectOption {
  label: string
  value: string
}

interface SelectNode extends BaseNode<string> {
  type: 'select'
  options: SelectOption[]
}

interface SliderNode extends BaseNode<number> {
  type: 'slider'
  min: number
  max: number
  step: number
}

interface ColorNode extends BaseNode<string> {
  type: 'color'
}

type FormNode = TextNode | AreaNode | SelectNode | SliderNode | ColorNode;

class Input {
  static async create(template: FormNode[]): Promise<void>;
}

// -------- TTS --------

class TTS {
  static async speak(text: string): Promise<void>;
}

// -------- Clipboard --------

class Clipboard {
  static async readImageBase64(): Promise<string>;
  static async readImageBytes(): Promise<Uint8Array>;
  static async writeImage(data: number[] | string): Promise<void>;
  static async readHTML(): Promise<string>;
  static async readRichText(): Promise<string>;
  static async readPlain(): Promise<string>;
  static async writeRichText(data: string): Promise<void>;
  static async writeText(data: string): Promise<void>;
  static async readFiles(): Promise<string[]>;
}

// -------- UUID --------

class UUID {
  static async generate(): Promise<string>;
}

declare global {
  interface Window {
    FileManager: FileManager;
    HTTP: HTTP;
    AI: AI;
    Config: Config;
    HTML: HTML;
    App: App;
    Input: Input;
    TTS: TTS;
    Clipboard: Clipboard;
    UUID: UUID;
  }
}
`