# PRTIMES/chatbot-ui

mckaywrigley/chatbot-ui を社内環境でセルフホストするためのリポジトリ

## デプロイ

1. main に push で deploy workflow をトリガー
   → Docker イメージをビルドして Artifact Registry に push します
2. 手動で以下を実行（権限周りが分からず GHA 内でできていない）

```sh
gcloud run deploy chatbot-ui --image=asia-northeast1-docker.pkg.dev/prtimes-inhouse-tools/chatbot-ui-artifact-registry/chatbot-ui:latest --region=asia-northeast1
```
