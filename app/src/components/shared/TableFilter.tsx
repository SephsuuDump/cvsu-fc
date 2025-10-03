import { Download, Funnel, Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { Dispatch, SetStateAction } from "react";
import { addBusinessDays } from "date-fns";

const pages = [10, 20, 30, 40, 50, 100]

export function TableFilter({ setSearch, searchPlaceholder, setOpen, buttonLabel, size, setSize, removeAdd }: {
    setSearch: (i: string) => void;
    searchPlaceholder: string;
    size: number;
    setSize: Dispatch<SetStateAction<number>>;
    removeAdd?: false | boolean;
    setOpen?: Dispatch<SetStateAction<boolean>>;
    buttonLabel?: string;
}) {
    return (
        <div className="flex items-center">
            <input
                className="py-1 pl-3 rounded-md bg-light shadow-xs w-100"
                placeholder={ searchPlaceholder }
                onChange={ e => setSearch(e.target.value) }
            />
            <div className="ms-auto flex gap-2">
                <div className="flex items-center gap-1">
                    <div className="text-sm text-gray">Showing</div>
                    <Select 
                        value={ String(size) }
                        onValueChange={ (value) => setSize(prev => Number(value)) }
                    >
                        <SelectTrigger className="bg-light shadow-xs">
                            <SelectValue placeholder="20" />
                        </SelectTrigger>
                        <SelectContent className="!w-fit">
                            {pages.map((item, i) => (
                                <SelectItem value={ String(item) } key={i}>{ item }</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <Select>
                    <SelectTrigger className="bg-light shadow-xs">
                        <Funnel className="text-dark" />
                        <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                </Select>
                <Button 
                    variant="secondary"
                    className="bg-light shadow-xs"
                >
                    <Download />
                    Export
                </Button>
                {!removeAdd && (
                    <Button 
                        onClick={ () => setOpen?.(prev => !prev) }
                        className="!bg-darkorange text-light shadow-xs hover:opacity-90"
                    >
                        <Plus /> { buttonLabel }
                    </Button>
                )}
            </div>
        </div>
    )
}