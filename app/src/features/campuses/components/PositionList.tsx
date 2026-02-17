import { Position } from "@/types/officer";
import { Separator } from "@/components/ui/separator";
import { Inbox } from "lucide-react";
import { AppRUDSelection } from "@/components/shared/AppRUDSelection";
import { useCrudState } from "@/hooks/use-crud-state";
import { Dispatch, SetStateAction } from "react";
import { UpdatePosition } from "./UpdatePosition";
import { DeletePosition } from "./DeletePosition";

export function PositionList({
    items, setReload
}: {
    items: Position[];
    setReload: Dispatch<SetStateAction<boolean>>
}) {
    const { toUpdate, setUpdate, toDelete, setDelete } = useCrudState<Position>();

    if (!items || items.length === 0) {
        return (
            <div className="py-10 text-center text-gray-500">
                <Inbox className="text-gray w-10 h-10 mx-auto mb-2" />
                <div>No positions found.</div>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 -mt-2 table-wrapper">
            {/* Table header */}
            <div className="thead flex-center-y">
                <div className="w-full grid grid-cols-4">
                    <div className="th">Position</div>
                    <div className="th">Assigned Officer</div>
                    <div className="th">Campus</div>
                    <div className="th">Date Assigned</div>
                </div>
                <div className="th w-10"></div>
            </div>

            <Separator className="h-3 bg-slate-300" />

            {/* Rows */}
            {items.map((position) => (
                <div
                    key={position.id}
                    className="tdata flex-center-y"
                >
                    <div className="w-full grid grid-cols-4">
                        <div className="td">
                            {position.position}
                        </div>

                        <div className="td stack-lg">
                            {position.users.length === 0 && (
                                <div className="text-gray">N/A</div>
                            )}
                            {position.users.map((user, i) => (
                                <div key={i}>
                                    {user.name}
                                </div>
                            ))}
                        </div>

                        <div className="td stack-lg">
                            {position.users.length === 0 && (
                                <div className="text-gray">N/A</div>
                            )}
                            {position.users.map((user, i) => (
                                <div key={i}>
                                    { user.campus.match(/University\s*-\s*(.+)/i)?.[1] ?? user.campus }
                                </div>
                            ))}
                        </div>

                        <div className="td stack-lg">
                            {position.users.length === 0 && (
                                <div className="text-gray">N/A</div>
                            )}
                            {position.users.map((user, i) => (
                                <div key={i}>
                                    {user.date_assigned}
                                </div>
                            ))}
                        </div>
                    </div>

                    <AppRUDSelection 
                        key={position.id}
                        className="mx-auto w-10"
                        item={ position }
                        setUpdate={ setUpdate }
                        setDelete={ setDelete }
                    />
                </div>
            ))}

            {toUpdate && (
                <UpdatePosition 
                    toUpdate={ toUpdate }
                    setUpdate={ setUpdate }
                    setReload={ setReload }
                />
            )}

            {toDelete && (
                <DeletePosition 
                    toDelete={ toDelete }
                    setDelete={ setDelete }
                    setReload={ setReload }
                />
            )}
        </div>
    );
}
