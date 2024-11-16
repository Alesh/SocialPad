import vkBridge, { VKBridge } from '@vkontakte/vk-bridge';

export type Bridge = Omit<VKBridge, 'sendPromise' | 'supports'>;
export default vkBridge;
