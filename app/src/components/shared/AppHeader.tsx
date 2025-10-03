import Image from "next/image";

export function AppHeader({ label, className }: {
    label: string;
    className?: string;
}) {
    return (
        <div className={`${className} flex items-center gap-2`}>
            <Image
                src="/images/cvsu_logo.png"
                alt="CvSU Logo"
                width={40}
                height={40}
            />
            <div className="text-xl font-semibold">{ label }</div>
        </div>
    )
}