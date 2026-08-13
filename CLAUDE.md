# プロジェクト運用ルール

## Git ブランチ運用

### 基本フロー

- 作業ブランチは **`main` ではなく `develop` から作成する**(`git checkout -b <branch> origin/develop`)。
- PR は **`develop` 宛て**に作成する。`main` 宛てに直接PRを作成しない。
- `develop` → `main` へのマージ(リリース)は、**ユーザーが明示的に指示した場合のみ**実施する。「公開して」「デプロイして」等の指示がない限り、作業ブランチのPRがマージされても `main` へは反映しない。

### ブランチ命名規則

既存の運用に合わせ、以下のプレフィックスを用いる。

- `feature/xxx` — 新機能
- `fix/xxx` — 不具合修正
- `chore/xxx` — 設定変更・依存関係更新などのメンテナンス
- `docs/xxx` — ドキュメントのみの変更

### 補足

- `main` へのpushは `.github/workflows/deploy.yml` によりGitHub Pagesへの自動デプロイをトリガーする。
- `main` は「Require a pull request before merging」のブランチ保護ルールが設定されており、直接pushはできない。

## コードレビュー

@docs/code-review-policy.md
