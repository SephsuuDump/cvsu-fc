import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"

type AppTextareaProps = {
    className?: string
    label?: string
    placeholder?: string
    noLabel?: boolean
    value?: string | number
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
    height?: number
}

export function AppTextarea({
    className,
    label,
    placeholder,
    noLabel,
    value,
    onChange,
    height,
}: AppTextareaProps) {
    return (
        <div className={`${className} stack-sm`}>
        {!noLabel && <Label>{label}</Label>}
        <Textarea
            placeholder={placeholder}
            value={value ?? ""}
            onChange={ onChange }
            className={`h-${height}`}
        />
        </div>
    )
}
