import TransitsBoxes from "src/components/transits/TrasitsBoxes";
import TransitsPageFrame from "src/components/transits/TransitsPageFrame";

export default function TransitsBoxesPage() {
  return (
    <TransitsPageFrame editReferer="/">
      {(aspects) => <TransitsBoxes data={aspects} />}
    </TransitsPageFrame>
  );
}
