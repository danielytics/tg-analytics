import { retrieveLaunchParams } from "@telegram-apps/sdk";
import { WebAppUser } from "@twa-dev/types";
import { App } from "../app";
import { Errors, throwError } from "../errors";
import { generateUUID } from "../utils/generateUUID";
import { sha256number, sha256hex } from "../utils/crypto";

export class SessionController {
  private sessionId: string;
  private userId: number;
  private userData: WebAppUser;
  private platform: string;
  private webAppStartParam: string;
  private userLocale: string;

  private appModule: App;

  constructor(app: App) {
    this.appModule = app;
  }

  public async init() {
    const lp = retrieveLaunchParams();
    const initData = lp.initData;
    const user = lp.initData?.user;
    if (!user) {
      throwError(Errors.USER_DATA_IS_NOT_PROVIDED);
    }

    // Create secure hashe of user ID to avoid PII
    this.userId = await sha256number(user.id);
    this.userData = {
      is_premium: user.isPremium,
      is_bot: user.isBot,
      language_code: user.languageCode,
      photo_url: user.photoUrl,
      id: this.userId,
      // Create secure hash of username to avoid PII
      username: await sha256hex(user.username),
      // Lets Not provide names to avoid PII
      first_name: "Anonymous",
      last_name: "",
    };
    this.userLocale = user.languageCode;
    this.webAppStartParam = initData.startParam;
    this.platform = lp.platform;
    this.sessionId = generateUUID(String(this.getUserId()));
  }

  public getSessionId() {
    return this.sessionId;
  }

  public getUserId() {
    return this.userId;
  }

  public getWebAppStartParam() {
    return this.webAppStartParam;
  }

  public getPlatform() {
    return this.platform;
  }

  public getUserLocale() {
    return this.userLocale;
  }

  public getUserData() {
    return this.userData;
  }

  public getUserIsPremium() {
    const userData = this.getUserData();

    return Boolean(userData?.is_premium);
  }

  public assembleEventSession() {
    return {
      session_id: this.getSessionId(),
      user_id: this.getUserId(),
      app_name: this.appModule.getAppName(),
      is_premium: this.getUserIsPremium(),
      platform: this.getPlatform(),
      locale: this.getUserLocale(),
      start_param: this.getWebAppStartParam(),
      client_timestamp: String(Date.now()),
    };
  }
}
