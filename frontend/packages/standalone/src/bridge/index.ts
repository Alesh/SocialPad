import StandaloneBridge from './StandaloneBridge.ts';
import bridgeExtender from './bridgeExtender.ts';

export type * from './types';
export { bridgeExtender };
const bridge = new StandaloneBridge();
export default bridge;
