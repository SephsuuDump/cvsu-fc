import { AppInput } from "@/components/shared/AppInput";
import { AppSelect } from "@/components/shared/AppSelect";
import { ModalTitle } from "@/components/shared/ModalTitle";
import { AddButton } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ModalLoader } from "@/components/ui/loader";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useFetchData } from "@/hooks/use-fetch-data";
import { useSearchFilter } from "@/hooks/use-search-filter";
import { hasEmptyField, updateField } from "@/lib/helper";
import { PositionService } from "@/services/officer.service";
import { CreatePositionType, Position } from "@/types/officer";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";

export function CreatePosition({ setOpen, setReload }: {
    setOpen: Dispatch<SetStateAction<boolean>>
    setReload: Dispatch<SetStateAction<boolean>>
}) {
    const [onProcess, setProcess] = useState(false);
    const [position, setPosition] = useState<CreatePositionType>({
        name: '',
        parent_position_id: 0,
        is_unique: true
    });

    const { data: positions, loading: positionsLoading } = useFetchData<Position>(
        PositionService.getAllPositions
    );

    const { search: positionSeach, setSearch: setPositionSearch, filteredItems: filteredPositions } = useSearchFilter(positions, ["position"])

    async function handleSubmit() {
        try {
            setProcess(true);
            if (hasEmptyField(position, ["parent_position_id"])) {
                return toast.error('Please fill up all fields')
            }
            const payload: CreatePositionType | Omit<CreatePositionType, "parent_position_id"> =
                position.parent_position_id === 0
                    ? {
                        name: position.name,
                        is_unique: position.is_unique,
                    }
                    : {
                        ...position,
                    };
            const data = await PositionService.createPosition(payload);
            if (data) {
                toast.success('Position created successfully.')
                setReload(prev => !prev)
                setOpen(false)
            }
        } catch (error) {
            toast.error(`${error}`)
        } finally { setProcess(false) }
    }

    if (positionsLoading) return <ModalLoader />
    return (
        <Dialog open onOpenChange={ setOpen }>
            <DialogContent>
                <ModalTitle label="Add a Position"/>
                <div className="stack-md gap-2 mt-2">
                    <AppInput
                        className="w-full"
                        label="Position Name"
                        value={ position.name }
                        onChange={ e => updateField(setPosition, 'name', e.target.value) }
                    />

                    <AppSelect 
                        label="Parent Position"
                        groupLabel="Positions"
                        value={ String(position.parent_position_id) }
                        items={[
                            { label: "No Parent Position", value: "0" },
                            ...filteredPositions.map((item) => ({
                                label: item.position,
                                value: String(item.id),
                            })),
                        ]}
                        placeholder="Select position"
                        onChange={(value) => {
                            setPosition((prev) => ({
                                ...prev,
                                parent_position_id: Number(value),
                            }));
                        }}
                        searchPlaceholder="Search for a position"
                        search={ positionSeach }
                        setSearch={ setPositionSearch }
                    />

                    <div className="flex flex-col gap-2">
                        <Label className="text-sm font-medium text-gray-700">
                            Position Type
                        </Label>

                        <RadioGroup
                            value={position.is_unique ? "true" : "false"}
                            onValueChange={(value) =>
                                setPosition((prev) => ({
                                    ...prev,
                                    is_unique: value === "true",
                                }))
                            }
                            className="flex gap-6"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="true" id="unique" />
                                <Label htmlFor="unique">
                                    One Officer Only
                                </Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="false" id="non-unique" />
                                <Label htmlFor="non-unique">
                                    Multiple Officers Allowed
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>
                </div>

                <form
                    onSubmit={ e => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                    className="flex justify-end gap-4 mt-2"
                >   
                    <DialogClose>Cancel</DialogClose>
                    <AddButton
                        type="submit"
                        label="Add Position"
                        loadingLabel="Adding Position"
                        onProcess={ onProcess }
                    />
                </form>
            </DialogContent>
        </Dialog>
    )
}