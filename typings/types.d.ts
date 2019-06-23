declare module '*.json' {
  const value: any;
  export default value;
}

declare module '@google-cloud/vision' {
  export class ImageAnnotatorClient {
    documentTextDetection(image: any): Promise<any>;
  }
}
