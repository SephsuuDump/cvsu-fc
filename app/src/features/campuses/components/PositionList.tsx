import { Position } from "@/types/officer";
import { Separator } from "@/components/ui/separator";
import { Inbox } from "lucide-react";

export function PositionList({
    items,
}: {
    items: Position[];
}) {
    if (!items || items.length === 0) {
        return (
            <div className="py-10 text-center text-gray-500">
                <Inbox className="text-gray w-10 h-10 mx-auto mb-2" />
                <div>No positions found.</div>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 -mt-2">
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
                        {/* Position */}
                        <div className="td">
                            {position.position}
                        </div>

                        {/* Assigned Officers */}
                        <div className="td !p-0 stack-md">
                            {position.users.length === 0 && (
                                <div className="text-gray-500">N/A</div>
                            )}
                            {position.users.map((user, i) => (
                                <div key={i}>
                                    {user.name}
                                </div>
                            ))}
                        </div>

                        {/* Campus */}
                        <div className="td !p-0 stack-md">
                            {position.users.length === 0 && (
                                <div className="text-gray-500">N/A</div>
                            )}
                            {position.users.map((user, i) => (
                                <div key={i}>
                                    {user.campus}
                                </div>
                            ))}
                        </div>

                        {/* Date Assigned */}
                        <div className="td !p-0 stack-md">
                            {position.users.length === 0 && (
                                <div className="text-gray-500">N/A</div>
                            )}
                            {position.users.map((user, i) => (
                                <div key={i}>
                                    {user.date_assigned}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
