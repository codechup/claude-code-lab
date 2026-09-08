<div align="center">

# claude-code-lab

**Bir ders açıkken bir tag'de checkout ettiğiniz depo.**

Gerçek hatalarla tohumlanmış, uygulamalı alıştırma başına bir kez etiketlenmiş küçük bir
TypeScript CLI ve HTTP servisi — böylece Claude Code Academy'deki her lab, tam olarak dersinin
anlattığı durumdan başlar.

[![Kurs](https://img.shields.io/badge/kurs-cc.codechup.com-B75434?style=for-the-badge&labelColor=17130F)](https://cc.codechup.com/tr/)
[![Tag](https://img.shields.io/badge/ders%20tag'i-98-2F6585?style=for-the-badge&labelColor=17130F)](https://github.com/codechup/claude-code-lab/tags)
[![Lisans](https://img.shields.io/badge/lisans-MIT-2F6B4A?style=for-the-badge&labelColor=17130F)](LICENSE)

[![CI](https://github.com/codechup/claude-code-lab/actions/workflows/ci.yml/badge.svg)](https://github.com/codechup/claude-code-lab/actions/workflows/ci.yml)
[![Claude review](https://github.com/codechup/claude-code-lab/actions/workflows/claude-review.yml/badge.svg)](https://github.com/codechup/claude-code-lab/actions/workflows/claude-review.yml)

[English](README.md) · **Türkçe**

</div>

---

## Bu nedir

Bu depo baştan sona okunmak için değil, bir tag'de checkout edilmek için var.

[CodeChup Claude Code Academy](https://cc.codechup.com/tr/) içindeki uygulamalı her ders bir tag
çifti adlandırır — alıştırmadan önceki durum için `-start`, sonraki durum için `-solution` — ve
dersin adımları yalnızca o kesin ağaç üzerinde anlam taşır. Yani buradaki asıl değerli şey kod
değil, koda sabitlenmiş 98 tag'dir.

Kodun kendisi `labtrack`: Node 24 TypeScript CLI (`commander`) olarak yazılmış bir görev takipçisi
ve ona eşlik eden bir HTTP API (`node:http`); ikisi de tek bir store modülünün ince sarmalayıcısı.
İçinde gerçekten yeniden üretilebilir birkaç küçük hata var; her biri [`BUGS.md`](BUGS.md) içinde
nasıl tetiklendiği ve hangi tag çiftinde bulunduğuyla belgelenmiş durumda. `main` temiz taban
çizgisidir: tohumlanmış her hata düzeltilmiş, her örnek skill ve hook yerinde, `npm test` yeşil.

## Hızlı başlangıç

```bash
git clone https://github.com/codechup/claude-code-lab.git
cd claude-code-lab
npm ci

npm test          # vitest — main üzerinde tamamı yeşil
npm run typecheck # tsc --noEmit
npm run lint      # eslint + prettier --check

npm start -- add "süt al" --priority 1   # CLI
npm run api                               # :3000 üzerinde HTTP API
```

Sonra, bir ders söylediğinde:

```bash
git checkout lesson/m02-02-start   # alıştırmadan önceki durum
# ... alıştırmayı yapın ...
git checkout lesson/m02-02-solution
```

Her checkout, bu deponun normal ve kendi içinde bütün bir durumudur. Tag değiştirdikten sonra
`npm ci`'yi yeniden çalıştırın — `package-lock.json` tag'ler arasında farklılaşabilir.

## Tag sözleşmesi

**Bu depodaki 98 tag geçmiş değil, içeriktir.** Her biri kursun 119 dersinden adıyla anılır ve
okurun takip ettiği sayfaya basılır. Bir tag'i başka bir commit'e taşımak, o okurun neyi checkout
ettiğini sessizce değiştirir; birini silmek, bir dersin ilk komutunu hataya çevirir.

Bu yüzden:

- **Tag'ler asla taşınmaz ve asla silinmez.** Geçmişi toparlamak için değil, bir çifti yeniden
  yönlendirmek için değil, bir rebase'in parçası olarak değil.
- **Uzaktaki bir tag ruleset'i bunu uygular.** `lesson-tags` ruleset'i GitHub üzerinde `lesson/*`
  için güncelleme ve silmeyi engeller; böylece bir tag'in force-push'u sessizce geçmek yerine
  başarısız olur.
- **Yeni işler `main` üzerine gider.** Kursun destekleyici materyali doğrudan oraya eklenir; yeni
  bir uygulamalı ders gerektirmedikçe yeni bir tag çifti açılmaz.

Bir tag'in gerçekten değişmesi gerekiyorsa — `-start` durumu bozuksa ya da ders başka bir
alıştırma etrafında yeniden yazıldıysa — izlenecek yol şudur:

1. Bu depoda bir issue açın: tag'in adı, neyin yanlış olduğu ve ona atıf yapan bütün ders slug'ları.
2. [`codechup/claude-code-training`](https://github.com/codechup/claude-code-training) içinde eşlik
   eden pull request'i açın; ilgili derslerin `lab.repo_tag` alanını ve metnini güncelleyin.
3. Var olanı yeniden yazmak yerine **yeni bir tag eklemeyi** (sonek almış bir çift) ve dersleri ona
   yönlendirmeyi tercih edin. Yalnızca bu mümkün değilse ruleset kaldırılır, tag taşınır ve ruleset
   geri konur — bu sırayla ve tek oturumda.

## Bir ders tag'ini nasıl adlandırır

Bir dersin frontmatter'ı (`claude-code-training` içinde
`content/<dil>/<seviye>/<modül>/NN-*.mdx`, şeması `src/content/schema.ts`) checkout edilecek tam
`-start` tag'ini `lab.repo_tag` alanında taşır — örneğin `repo_tag: 'lesson/m02-02-start'` — ve
`<Lab>` bileşeni bunu `git checkout {repoTag}` olarak basar (`src/components/mdx/Lab.astro`,
`src/components/mdx/lab.ts`). Eşleşen `-solution` tag'i aynı gövdenin `-start` yerine `-solution`
almış hâlidir. Uygulamalı lab'i olmayan ya da henüz etiketlenmemiş bir ders `repo_tag: 'none'`
kullanır (M0 örnek dersine bakın: `m01-start/01-what-claude-code-is`).

## Ders tag haritası

49 ders çifti, 98 tag; `docs/CURRICULUM.md` §2 içinde `Lab` işaretli her dersi kapsar.
"Değişiklik" sütunu bir çiftin `-start` ve `-solution` commit'i arasında gerçekte neyin
farklılaştığını söyler — hata düzeltmeleri için bir `BUGS.md` kaydı, diğerleri için kısa bir
açıklama.

"Yalnızca süreç" çiftleri `-start` ve `-solution`'ı bilerek aynı commit'e yönlendirir: o dersler
buradaki bir kod değişikliği değil, Claude Code'un kendi CLI ya da arayüz davranışı hakkındadır,
dolayısıyla diff'lenecek bir şey yoktur. m01–m09 modüllerinde bu commit, tablodaki her yapısal
ekleme yerine oturduktan sonraki kararlı `main` ucudur. m10'dan itibaren ise _o dersin sıradaki
konumunda_ uç olan commit'tir — her modül müfredat sırasına göre, bir öncekinin üzerine
etiketlendi — bu yüzden `lesson/m11-03-*`, tablonun son ucunu değil, `lesson/m11-02-solution`
indikten hemen sonraki commit'i gösterir.

### 1. Seviye · Başlangıç ve 2. Seviye · Orta Seviye (m01–m09)

| Ders                            | Tag öneki       | Değişiklik                                                                      |
| ------------------------------- | --------------- | ------------------------------------------------------------------------------- |
| m01-02-install                  | `lesson/m01-02` | Yalnızca süreç — Claude Code'un kendisini kurmak.                               |
| m01-04-first-session            | `lesson/m01-04` | **B4** — `addTask` içinde eksik girdi doğrulaması.                              |
| m02-02-tools-read-edit-run      | `lesson/m02-02` | **B1** — bir eksikli (off-by-one) sayfalama.                                    |
| m02-03-permissions              | `lesson/m02-03` | Yalnızca süreç — izin modu gösterimi.                                           |
| m02-04-plan-mode                | `lesson/m02-04` | **B5** — gerçek zamanlayıcıya bağlı, kararsız bir test.                         |
| m02-05-checkpoints-rewind       | `lesson/m02-05` | **B2** — yanlış birimde tarih karşılaştırması (ms yerine s).                    |
| m03-01-claude-md                | `lesson/m03-01` | Bu deponun kendi `.claude/CLAUDE.md`'sini ekler.                                |
| m03-03-rules                    | `lesson/m03-03` | `.claude/rules/style.md` ekler.                                                 |
| m04-02-cli-flags                | `lesson/m04-02` | Yalnızca süreç — `claude` CLI bayrakları.                                       |
| m04-03-sessions                 | `lesson/m04-03` | Yalnızca süreç — `/resume` ve `/branch`.                                        |
| m05-02-choosing-a-model         | `lesson/m05-02` | **B3** — ele alınmamış promise reddi, modeller arası görev olarak.              |
| m05-04-effort-lab               | `lesson/m05-04` | **B2** — efor seviyeleri arası görev olarak yeniden kullanıldı.                 |
| m06-03-arguments                | `lesson/m06-03` | `.claude/skills/commit-msg/` ekler (yalnızca prompt, `$ARGUMENTS`).             |
| m06-04-prompt-only-skills       | `lesson/m06-04` | `.claude/skills/review-security/` ekler (yalnızca prompt, kontrol listesi).     |
| m06-05-tool-running-skills      | `lesson/m06-05` | `.claude/skills/new-component/` ekler (tool çalıştıran, `context: fork`).       |
| m07-02-block-dangerous-commands | `lesson/m07-02` | `.claude/hooks/guard-dangerous-commands.mjs` ekler (PreToolUse).                |
| m07-03-format-on-save           | `lesson/m07-03` | `.claude/hooks/format-on-save.mjs` ekler (PostToolUse).                         |
| m07-04-notify-when-done         | `lesson/m07-04` | `.claude/hooks/notify-done.mjs` ekler (Notification/Stop).                      |
| m07-05-session-start-context    | `lesson/m07-05` | `.claude/hooks/session-context.mjs` ekler (SessionStart + Stop).                |
| m08-01-commits-and-conventions  | `lesson/m08-01` | Yalnızca süreç — conventional commit alıştırması.                               |
| m08-02-worktrees-branches       | `lesson/m08-02` | Yalnızca süreç — worktree'ler ve dallar.                                        |
| m08-03-pull-requests            | `lesson/m08-03` | Yalnızca süreç — kanıtla birlikte bir PR açmak.                                 |
| m08-04-code-review-commands     | `lesson/m08-04` | **B1** — yeniden kullanıldı: sayfalama düzeltmesini PR diff'i olarak incelemek. |

### 3. Seviye · İleri Seviye ve 4. Seviye · Uzmanlık (m10–m21)

| Ders                            | Tag öneki       | Değişiklik                                                                                                                                                                                                                                                                                                          |
| ------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| m10-03-agent-lab                | `lesson/m10-03` | `.claude/agents/` ekler (code-reviewer, test-writer, docs-writer, researcher).                                                                                                                                                                                                                                      |
| m10-05-fork-background-worktree | `lesson/m10-05` | Yalnızca süreç — fork ve arka plan agent'ları, worktree'ler.                                                                                                                                                                                                                                                        |
| m11-02-add-list-remove-scopes   | `lesson/m11-02` | Örnek bir `.mcp.json` ekler (github, playwright sunucuları).                                                                                                                                                                                                                                                        |
| m11-03-github-mcp               | `lesson/m11-03` | Yalnızca süreç — GitHub MCP server kullanımı.                                                                                                                                                                                                                                                                       |
| m11-04-browser-mcp              | `lesson/m11-04` | Yalnızca süreç — Playwright ve Chrome MCP.                                                                                                                                                                                                                                                                          |
| m11-05-database-mcp             | `lesson/m11-05` | Yalnızca süreç — SQLite ve Postgres MCP.                                                                                                                                                                                                                                                                            |
| m11-06-write-your-own-server    | `lesson/m11-06` | `mcp/` ekler: tek tool'lu (`labtrack_status`) minimal bir MCP server; `.mcp.json`'a kaydeder.                                                                                                                                                                                                                       |
| m12-02-marketplaces             | `lesson/m12-02` | Yalnızca süreç — plugin keşfetmek ve kurmak.                                                                                                                                                                                                                                                                        |
| m12-03-build-a-plugin           | `lesson/m12-03` | `plugins/labtrack-tools/` ekler (m06-03 skill'i + m07-03 hook'u, paketlenmiş). `-start`'ı bu commit'ten hemen önceki uçta durur; o uç aşağıdaki m13-01 ve m13-02 dosyalarını da içeriyordu — bu tablo yazılırken yapılan bir sıralama düzeltmesi; `-solution`'a olan diff yine tam olarak plugin'in beş dosyasıdır. |
| m13-01-claude-p                 | `lesson/m13-01` | `scripts/headless-example.sh` ekler.                                                                                                                                                                                                                                                                                |
| m13-02-github-actions-review    | `lesson/m13-02` | `.github/workflows/claude-review.yml` ekler.                                                                                                                                                                                                                                                                        |
| m13-03-issue-to-pr              | `lesson/m13-03` | Yalnızca süreç — aynı workflow üzerinden issue ve PR'larda `@claude`.                                                                                                                                                                                                                                               |
| m13-05-agent-sdk-typescript     | `lesson/m13-05` | Yalnızca süreç — dışarıdan `@anthropic-ai/claude-agent-sdk` kullanımı.                                                                                                                                                                                                                                              |
| m13-06-agent-sdk-python         | `lesson/m13-06` | Yalnızca süreç — aynısı, Python SDK ile.                                                                                                                                                                                                                                                                            |
| m14-02-prompt-injection         | `lesson/m14-02` | **B6** — temizlenmemiş `renderNote()`.                                                                                                                                                                                                                                                                              |
| m14-03-secrets                  | `lesson/m14-03` | **B7** — başlangıçta loglanan API token'ı; ayrıca `.gitleaks.toml` ekler.                                                                                                                                                                                                                                           |
| m15-01-vs-code                  | `lesson/m15-01` | Yalnızca süreç — VS Code eklentisi.                                                                                                                                                                                                                                                                                 |
| m15-06-chrome                   | `lesson/m15-06` | Yalnızca süreç — Claude in Chrome.                                                                                                                                                                                                                                                                                  |
| m16-04-pipeline-lab             | `lesson/m16-04` | `WORKFLOW.md` ekler: bir inceleme → doğrulama → düzeltme pipeline brief'i.                                                                                                                                                                                                                                          |
| m17-01-loop                     | `lesson/m17-01` | `scripts/loop-check.sh` ekler.                                                                                                                                                                                                                                                                                      |
| m17-02-routines                 | `lesson/m17-02` | `routines/nightly-regression-check.md` ekler.                                                                                                                                                                                                                                                                       |
| m18-02-state-md-and-claims      | `lesson/m18-02` | `plans/` (`P01-cli-usability.md`, `P02-api-error-docs.md`, ikisi de `todo`) ve `STATE.md` ekler.                                                                                                                                                                                                                    |
| m18-03-owned-paths-worktrees    | `lesson/m18-03` | İki planı da sahiplenir — `todo` → `in_progress`, ayrık `owned_paths`, ayrı worktree'ler.                                                                                                                                                                                                                           |
| m18-05-handoff-notes            | `lesson/m18-05` | İki planı da gerçekten uygular (CLI yardım metni ve `--version`, `docs/API.md`), Handoff notlarını doldurur, `review`'a taşır; `scripts/plan.mjs` ekler.                                                                                                                                                            |
| m19-01-artifacts                | `lesson/m19-01` | `artifacts/task-activity.csv` ve README'sini ekler — Artifact olarak yayımlanacak örnek veri.                                                                                                                                                                                                                       |
| m19-03-chrome-automation        | `lesson/m19-03` | Yalnızca süreç — bu depoyu Claude in Chrome ile sürmek.                                                                                                                                                                                                                                                             |

`BUGS.md`'deki B6 ve B7 artık "ayrılmış" değil: ikisi de düzeltildi ve B1–B5 gibi etiketlendi.

### Tag'i olmayan modüller: m20-team, m21-scale

`docs/CURRICULUM.md` §2 içinde iki modülün de `Lab` işaretli tek bir dersi yok — ikisindeki her
ders ya süreçle ilgili (ayarlar, bütçeler, yaygınlaştırma, caching, gateway'ler) ya da bundan
büyük bir kod tabanına uygulanan bir strateji hakkında; _bu_ depoda uygulamalı bir değişiklik
değil. Destekleyici materyalleri yine burada yaşıyor, doğrudan `main`'e eklendi, `-start`/`-solution`
çifti olmadan:

- **m20-team** — `.claude/settings.json` içindeki ekip allowlist'i ve deny-list'i, `MARKETPLACE.md`.
- **m21-scale** — `large/`: büyük kod tabanında gezinme ve bağlam mühendisliği alıştırmaları için
  5 alana yayılmış 30 üretilmiş yer tutucu modül.

## Depo yapısı

```
src/
  types.ts        Task arayüzü, InvalidTaskError
  store.ts        bütün iş mantığı (CLI ve API bunun ince sarmalayıcılarıdır)
  cli.ts          labtrack CLI (commander): add, list, show, done, rm, --version
  api/server.ts   küçük bir HTTP API: GET/POST /tasks, GET /health, ... (docs: docs/API.md)
test/             vitest — alan başına bir dosya (store, overdue, persist, api, security,
                  cli-usability)
.claude/          bu deponun kendi minimal Claude Code kurulumu: CLAUDE.md, bir rule, 4 hook,
                  3 skill, 4 agent (code-reviewer, test-writer, docs-writer, researcher),
                  settings.json (küçük bir ekip allowlist'i + deny list) — öğretim materyali,
                  tam bir dogfooding kurulumu değil
BUGS.md           tohumlanmış her hata: ne olduğu, nasıl yeniden üretileceği, tag çifti
.mcp.json         örnek MCP server yapılandırması: github, playwright ve bu deponun kendi
                  labtrack sunucusu
mcp/              minimal bir stdio MCP server (@modelcontextprotocol/sdk), tek tool
                  (labtrack_status) — kendi package.json'ı var, kök npm script'lerine dokunmaz
plugins/          labtrack-tools: commit-msg skill'i + format-on-save hook'u, kurulabilir bir
                  plugin olarak paketlenmiş
scripts/          headless-example.sh (claude -p), loop-check.sh (bir /loop hedefi),
                  plan.mjs (sahiplenilebilir plans/*.md dosyalarını listeler)
routines/         örnek bir routine tanımı (cron tetikli, depo tarafı brief)
plans/, STATE.md  eğitim deposunun kendi frontmatter kuralıyla iki örnek plan ve üretilmiş
                  görünümlü bir STATE.md
WORKFLOW.md       inceleme → doğrulama → düzeltme pipeline brief'i (Workflow tool'u)
artifacts/        Artifact ve dataviz lab'leri için örnek veri (task-activity.csv)
large/            büyük kod tabanında gezinme lab'leri için 30 üretilmiş yer tutucu modül
                  — tasarım gereği tsconfig.json ve vitest.config.ts include glob'larının dışında
MARKETPLACE.md    bu deponun bir ekip plugin marketplace'i olarak paylaştıkları
.gitleaks.toml    bu deponun secret tarama temeli
.github/workflows/
  ci.yml            her push ve PR'da typecheck + lint + test
  claude-review.yml anthropics/claude-code-action@v1 PR incelemesi (secret olmadan no-op)
```

## Transcript'ler

Ders yazarlarına: bir `-start`/`-solution` çiftine karşı gerçekten çalıştırdığınız oturumu
kaydedin — `claude-code-training` içindeki `docs/CURRICULUM.md` §4.3 uyarınca her lab gerçekten
çalıştırılmalıdır, asla yeniden kurgulanmaz — ve kırpılmış transcript'i burada değil, o deponun
`content/_shared/transcripts/<modül>/<slug>/` dizininde saklayın.

## Lisans

[MIT](LICENSE) — Telif hakkı (c) 2026 CodeChup. Claude ve Claude Code, Anthropic'in ticari
markalarıdır; bu bağımsız ve bağlantısız bir kurstur.
