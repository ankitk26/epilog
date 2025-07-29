type Props = {
  name: string;
  releaseYear: number;
};

export default function KanbanCardInfo(props: Props) {
  return (
    <div className="flex-1 min-w-0">
      <h4 className="font-semibold text-foreground text-sm line-clamp-2 leading-tight mb-1 drop-shadow-lg">
        {props.name}
      </h4>
      <p className="text-foreground/90 text-xs drop-shadow-md">
        {props.releaseYear}
      </p>
    </div>
  );
}
