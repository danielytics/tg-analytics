import { App } from "../app";
import { TonConnectObserver } from "../observers/TonConnect.observer";
import { DocumentObserver } from "../observers/Document.observer";
import { BACKEND_URL, Events, STAGING_BACKEND_URL } from "../constants";
import { WebAppObserver } from "../observers/WebApp.observer";
import { WebViewObserver } from "../observers/WebView.observer";

export class AnalyticsController {
  private appModule: App;
  private tonConnectObserver: TonConnectObserver;
  private documentObserver: DocumentObserver;
  private webAppObserver: WebAppObserver;
  private webViewObserver: WebViewObserver;

  private eventsThreshold: Record<string, number> = {
    "app-hide": 3,
  };

  constructor(app: App) {
    this.appModule = app;

    this.documentObserver = new DocumentObserver(this);
    this.tonConnectObserver = new TonConnectObserver(this);
    this.webAppObserver = new WebAppObserver(this);
    this.webViewObserver = new WebViewObserver(this);
  }

  public async init() {
    this.documentObserver.init();
    this.tonConnectObserver.init();
    this.webAppObserver.init();
    this.webViewObserver.init();

    try {
      this.eventsThreshold = await (
        await fetch(
          (this.appModule.env === "STG" ? STAGING_BACKEND_URL : BACKEND_URL) + "events/threshold",
          {
            signal: AbortSignal.timeout(2000),
          },
        )
      ).json();
    } catch (e) {
      console.error(e);
    }
  }
}
