//umiIdentityをContext取得。umi.use(walletIdentity(wallet))に変更する。

import { HarigamiForm } from "@/pages/HarigamiForm";

export default function Page() {
  return (
    <div className="mobile-like">
      <HarigamiForm />
    </div>
  );
}
