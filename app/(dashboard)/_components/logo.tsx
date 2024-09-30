import Image from "next/image";
import Netra from "../../../public/netra.png"

export const Logo = () => {
    return (
        <Image src={Netra} alt="logo" width={130} height={130} />
    );
};