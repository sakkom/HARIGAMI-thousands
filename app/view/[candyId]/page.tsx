"use client";

import { HarigamiInfo } from "@/pages/HarigamiInfo";
import { HarigamiDashboard } from "@/pages/HarigamiDashboard";
import { publicKey } from "@metaplex-foundation/umi";
import { useContext } from "react";
import { UmiContext } from "@/context/UmiProvider";
import { useHarigamiDetail } from "@/hooks/useHarigamiDetail";

export default function Page({ params }: { params: { candyId: string } }) {
  const umi = useContext(UmiContext);
  const candyId = publicKey(params.candyId);
  const detail = useHarigamiDetail(umi, candyId);

  return (
    <>
      {detail && (
        <div className="mobile-like">
          <HarigamiInfo detail={detail} />
          <HarigamiDashboard />
        </div>
      )}
    </>
  );
}
