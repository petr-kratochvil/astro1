import { useTranslation } from "react-i18next";
import AspectTable from "src/components/tables/AspectTable";
import TransitsPageFrame from "src/components/transits/TransitsPageFrame";

const tableStyle = {
  display: "flex",
  justifyContent: "space-evenly",
  marginTop: "20px",
  flexWrap: "wrap",
} as const;

export default function TransitsTablePage() {
  const { t } = useTranslation();

  return (
    <TransitsPageFrame editReferer="/transits-table">
      {(aspects) => (
        <div style={tableStyle} className="smallFont">
          <AspectTable
            aspectChart={aspects}
            title=""
            name1={t("transits.transiting")}
            name2={t("transits.natal")}
            style={{ useSignSymbols: true, useSignText: false }}
          />
        </div>
      )}
    </TransitsPageFrame>
  );
}
