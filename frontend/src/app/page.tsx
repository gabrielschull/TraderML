import Image from "next/image";
import { TitleSection } from "@/components/ui/title-section";
import { OrderSelector } from "@/components/ui/order-selector";

export default function Home() {
  return (
    <div>
    <TitleSection/>
    <OrderSelector/>
    </div>
  );
}
