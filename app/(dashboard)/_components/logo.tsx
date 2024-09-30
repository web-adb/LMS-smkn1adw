import Image from "next/image";
import Netra from "../../../public/Netra2.jpg"

export const Logo = () => {
    return (
        <Image src={Netra} alt="logo" width={70} height={130} />
    );
};