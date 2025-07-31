type Props = {
  name: string;
  releaseYear: number;
};

export default function KanbanCardInfo(props: Props) {
  return (
    <div className="min-w-0 flex-1">
      <h4 className="mb-1 line-clamp-2 font-semibold text-sm text-white leading-tight drop-shadow-lg">
        {props.name}
      </h4>
      <p className="text-white/90 text-xs drop-shadow-md">
        {props.releaseYear}
      </p>
    </div>
  );
}
