# Telegram Analytics Fork

This fork aims to fix some major flaws in the Telegram Analytics SDK:

1. **GDPR-compliance**: desipte the claim that the SDK is compliant, its not because it sends Telegram User's ID and usernames, which meet the definition of Personally Identifying Information (PII). This fork hashes the ID's before sending them.
2. **Trust**: the SDK loads obfuscated javascript and WASM from their server. This fork includes the unobfuscated javascript in the codebase, and lets you configure where to load the WASM module from (including hosting it yourself so you can be sure its loading what you expect).
3. **Control**: This fork allows you to configure which analytics to send to their backend

Through these changes, this fork aims to be a safer and more trustworthy alternative, while still providing the analytics that the Telegram App Center requires for including apps in their catalog.

**Current status:**

1. All PII is hashed using SHA-256 (although truncated to fit into a javascript number)
2. WASM is still being loaded from untrusted source
3. Only configured events are collected -- however it does the check quite late, for now. An improved future version will avoid setting up listeners for data that won't be collected.

## Installation

> [!IMPORTANT]
>First of all, you must generate an access token through the [TON Builders](https://builders.ton.org). For detailed instructions on how to connect SDK and receive a token, please refer to the [documentation](https://docs.tganalytics.xyz/).

After token generation, you need to initialize the SDK.

It is recommended you build it from source including building and self-hosting the WASM module. [TODO: Add instructions]

To ensure that all events are collected correctly, you must initialize the SDK before the application starts rendering. For example, in react applications, before calling the render() function

```javascript
import telegramAnalytics, { Events } from '@danielytics/analytics';

telegramAnalytics.init({
    token: 'YOUR_TOKEN', // SDK Auth token received via @DataChief_bot
    appName: 'ANALYTICS_IDENTIFIER', // The analytics identifier you entered in @DataChief_bot
    wasmUrl: '/analytics.wasm', // Where to load the WASM module from
    events: [
      // Remove any events you do not wish to send
      Events.INIT,
      Events.HIDE,
      Events.CUSTOM_EVENT,
      Events.WALLET_CONNECT_STARTED,
      Events.WALLET_CONNECT_SUCCESS,
      Events.WALLET_CONNECT_ERROR,
      Events.CONNECTION_RESTORING_STARTED,
      Events.CONNECTION_RESTORING_SUCCESS,
      Events.CONNECTION_RESTORING_ERROR,
      Events.TRANSACTION_SENT_FOR_SIGNATURE,
      Events.TRANSACTION_SIGNED,
      Events.TRANSACTION_SIGNING_FAILED,
      Events.WALLET_DISCONNECT,
      Events.ADDITIONAL_TASK_EVENT,
      Events.PURCHASE_INIT,
      Events.PURCHASE_SUCCESS,
      Events.PURCHASE_FAILED,
      Events.PURCHASE_CANCELLED,
      Events.REFUND_ISSUED,
      Events.SUBSCRIPTION_STARTED,
      Events.SUBSCRIPTION_RENEWED,
      Events.SUBSCRIPTION_CANCELLED,
      Events.INVOICE_REGISTERED,
    ]
});
```

-----

After initializing the Telegram Analytics, you are all set to transfer the data, gain insights, and improve user engagement. (99% of them will be tracked automatically without manual control)

## 🤝 Contributing [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

Contributions are welcome! To contribute, fork the repository, make your changes, and submit a pull request. We look forward to your innovative [ideas](https://github.com/Telegram-Mini-Apps/TelegramAnalytics/pulls) and improvements.

## License

This Telegram Analytics SDK is available under the [MIT License](https://opensource.org/license/mit). Feel free to use it in both personal and commercial projects.

The library was expertly developed by [sorawalker](https://github.com/sorawalker), with generous support from [TON Foundation](https://github.com/ton-society/grants-and-bounties/).
