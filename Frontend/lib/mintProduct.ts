import {
  openContractCall,
  showConnect,
  AppConfig,
  UserSession,
  FinishedTxData
} from "@stacks/connect";
import { stringUtf8CV, uintCV } from "@stacks/transactions";
import { STACKS_TESTNET } from "@stacks/network";

// Leather cüzdan oturum ayarı
const appConfig = new AppConfig(["store_write", "publish_data"]);
const userSession = new UserSession({ appConfig });

export async function mintProduct(title: string, price: number): Promise<boolean> {
  console.log("🧪 mintProduct çağrıldı:", title, price);

  // Eğer wallet bağlı değilse, kullanıcıyı bağlamaya zorla
  if (!userSession.isUserSignedIn()) {
    console.log("👛 Wallet bağlı değil, bağlantı başlatılıyor...");

    return new Promise((resolve) => {
      showConnect({
        userSession,
        appDetails: {
          name: "ChainGo",
          icon: window.location.origin + "/logo.png"
        },
        onFinish: () => {
          console.log("✅ Wallet bağlandı, sayfa yenileniyor...");
          window.location.reload();
          resolve(false);
        },
        onCancel: () => {
          console.warn("⛔ Wallet bağlantısı iptal edildi.");
          resolve(false);
        }
      });
    });
  }

  // Contract call işlemi
  const txOptions = {
    contractAddress: "ST3X1SSGG17H44ASNF0EGCGNR3WTD64K4XQTWPCP2", // 💥 Buraya testnet kontrat adresini yaz
    contractName: "product-market",
    functionName: "mint-product",
    functionArgs: [stringUtf8CV(title), uintCV(price)],
    network: STACKS_TESTNET,
    appDetails: {
      name: "ChainGo",
      icon: window.location.origin + "/logo.png"
    },
    onFinish: (data: FinishedTxData) => {
      console.log("✅ Mint işlemi tamamlandı:", data);

      // İsteğe bağlı olarak explorer linki göster
      const explorerUrl = `https://explorer.stacks.co/txid/${data.txId}?chain=testnet`;
      console.log("🔗 Explorer'da gör:", explorerUrl);
      alert(`✅ Mint işlemi gönderildi!\nExplorer: ${explorerUrl}`);
    },
    onCancel: () => {
      console.warn("⛔ Mint işlemi kullanıcı tarafından iptal edildi.");
      alert("Mint işlemi iptal edildi.");
    }
  };

  console.log("📤 openContractCall tetikleniyor...");
  await openContractCall(txOptions);

  return true;
}
