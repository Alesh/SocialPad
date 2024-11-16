import { Bridge, miniappBridge } from '@socialpad/miniapp';
import { standaloneBridge } from '@socialpad/standalone';

const bridge = <Bridge>(miniappBridge.isStandalone() ? standaloneBridge : miniappBridge);

type UserInfo = Awaited<ReturnType<typeof bridge.send<'VKWebAppGetUserInfo'>>>;

export type { UserInfo };
export default bridge;
