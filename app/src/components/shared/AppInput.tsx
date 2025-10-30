import { Input } from "../ui/input"
import { Label } from "../ui/label"

type AppInputProps = {
    className?: string
    label?: string
    placeholder?: string
    noLabel?: boolean
    value?: string | number
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    type?: "text" | string
    readonly?: false | true
}

export function AppInput({
    className,
    label,
    placeholder,
    noLabel,
    value,
    onChange,
    type,
    readonly
}: AppInputProps) {
    return (
        <div className={`${className} stack-sm`}>
        {!noLabel && <Label>{label}</Label>}
        <Input
            placeholder={placeholder}
            value={value ?? ""}
            onChange={ onChange }
            type={ type }
            readOnly={ readonly }
        />
        </div>
    )
}
