cask "aegis-vault" do
  arch arm: "aarch64"

  version "0.2.0"
  sha256 "9c316c57b0e5cd5dc408a19b517cfa892b9b958a4240073e3a0c9ccae8f58aaf"

  url "https://github.com/DrXendria/Aegis/releases/download/v#{version}/Aegis_#{version}_#{arch}.dmg"
  name "Aegis Vault"
  desc "100% local, two-layer zero-knowledge password manager"
  homepage "https://github.com/DrXendria/Aegis"

  app "Aegis.app"

  zap trash: [
    "~/Library/Application Support/com.drxendria.aegis",
    "~/Library/Caches/com.drxendria.aegis",
    "~/Library/Preferences/com.drxendria.aegis.plist",
  ]
end
