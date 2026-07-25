declare module "@ungap/structured-clone" {
  type StructuredCloneOptions = {
    json?: boolean;
    lossy?: boolean;
  };

  export default function structuredClone<T>(
    value: T,
    options?: StructuredCloneOptions,
  ): T;
}

declare module "react-native/Libraries/Utilities/PolyfillFunctions" {
  export function polyfillGlobal<T>(
    name: string,
    getValue: () => T,
  ): void;
}
