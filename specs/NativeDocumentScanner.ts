import type {TurboModule} from 'react-native';
import {TurboModuleRegistry} from 'react-native';

export interface Spec extends TurboModule {
  scanDocument(pageLimit: number): Promise<string>;
}

export default TurboModuleRegistry.getEnforcing<Spec>(
  'NativeDocumentScanner',
);
