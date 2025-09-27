export type EventData = {
  event: string;
  player_id: string;
  content?: { current: { x: number; y: number } };
};

export class WsEventHandler {
  private scene: Phaser.Scene | null = null;

  setScene(scene: Phaser.Scene) {
    this.scene = scene;
  }

  handle(data: EventData) {
    if (!this.scene) return;
    this.scene.events.emit(data.event, data);
  }
  // private handleLogin(data: EventData) {
  //   if (!this.scene) return;
  //   console.log("login受信" + data.player_id);
  //   this.scene.events.emit("remoteCommand", {
  //     type: "login",
  //     player_id: data.player_id,
  //   });
  //   // ここでイベント送信
  // }
  // private handleLogout(data: EventData) {
  //   if (!this.scene) return;
  //   console.log("logout受信" + data.player_id);
  //   this.scene.events.emit("remoteCommand", {
  //     type: "logout",
  //     player_id: data.player_id,
  //   });
  // }
}
