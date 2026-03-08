import { Calendar, Hash, List, ToggleLeft, Type } from "lucide-react";
import type { ColumnType } from "../../types";

export const TypeIcon = ({
  type,
  className,
}: {
  type: ColumnType;
  className?: string;
}) => {
  switch (type) {
    case "String":
      return <Type className={className} />;
    case "Number":
      return <Hash className={className} />;
    case "Date":
      return <Calendar className={className} />;
    case "Boolean":
      return <ToggleLeft className={className} />;
    case "Enum":
      return <List className={className} />;
    default:
      return <Type className={className} />;
  }
};
