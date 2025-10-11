// イベント固有のcontentを定義
export type EventContentMap = {
  position: {
    current: { x: number; y: number };
  };
  login: {
    username: string;
    timestamp: number;
  };
  logout: {
    reason?: string;
  };
  allChat: {
    message: string;
    timestamp?: number;
  };
};
// ベースのEventData型をジェネリクスに変更
export type EventData<T extends keyof EventContentMap = keyof EventContentMap> =
  {
    event: T;
    player_id: string; //発信元のユーザid
    content?: EventContentMap[T];
  };

// 特定のイベント用の型エイリアス
export type PositionEventData = EventData<"position">;
export type LoginEventData = EventData<"login">;
export type LogoutEventData = EventData<"logout">;
export type AllChatEventData = EventData<"allChat">;

export class WsEventHandler {
  private scene: Phaser.Scene | null = null;

  setScene(scene: Phaser.Scene) {
    //ParkGameやHomeGameからシーンをここへもってくる
    this.scene = scene;
  }

  handle<T extends keyof EventContentMap>(data: EventData<T>) {
    if (!this.scene) return;
    // 該当シーンへイベントを処理するようにemit
    this.scene.events.emit(data.event, data);
  }
}
