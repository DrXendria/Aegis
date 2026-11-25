bu# Free Package Manager Submission Guide (v0.2.0)

All manifests in this directory already include verified **SHA256** checksums from the live `v0.2.0` GitHub Release.

---

## 1. AUR (Arch Linux — `yay -S aegis-vault-bin`)
1. Create a free account at https://aur.archlinux.org and add your SSH public key under **My Account**.
2. Run:
   ```bash
   git clone ssh://aur@aur.archlinux.org/aegis-vault-bin.git /tmp/aegis-vault-bin
   cp packaging/aur/PKGBUILD packaging/aur/.SRCINFO /tmp/aegis-vault-bin/
   cd /tmp/aegis-vault-bin
   git add PKGBUILD .SRCINFO
   git commit -m "Initial release: aegis-vault-bin 0.2.0"
   git push origin master
   ```
3. Live immediately! Arch users can install via `yay -S aegis-vault-bin`.

---

## 2. Winget (Windows — `winget install DrXendria.Aegis`)
1. Fork https://github.com/microsoft/winget-pkgs on GitHub.
2. Copy the 3 YAML files from `packaging/winget/` into your fork under:
   ```text
   manifests/d/DrXendria/Aegis/0.2.0/
   ```
3. Open a Pull Request to `microsoft/winget-pkgs` titled `New package: DrXendria.Aegis version 0.2.0`.
4. Microsoft's automated bot validates hashes/installers and merges within 1–2 days.

---

## 3. Homebrew Tap (macOS — `brew install --cask drxendria/tap/aegis-vault`)
1. Create a public GitHub repo named **`DrXendria/homebrew-tap`**.
2. Push `packaging/homebrew/Casks/aegis-vault.rb` to `Casks/aegis-vault.rb` in that repo.
3. Live immediately! macOS users run:
   ```bash
   brew tap drxendria/tap
   brew install --cask aegis-vault
   ```

---

## 4. Flathub (All Linux App Stores — `flatpak install com.drxendria.aegis`)
1. Fork https://github.com/flathub/flathub and create a new branch from **`new-pr`**.
2. Add `packaging/flathub/com.drxendria.aegis.yml` and `packaging/flathub/com.drxendria.aegis.metainfo.xml` to the repo root of that branch.
3. Add at least 1 screenshot URL (`<screenshots>`) in `com.drxendria.aegis.metainfo.xml` (Flathub requires 1+ screenshot).
4. Open a Pull Request against `flathub/flathub` (`new-pr` branch). Once approved (2–5 days), Aegis appears in Fedora Discover, GNOME Software, and SteamOS.
