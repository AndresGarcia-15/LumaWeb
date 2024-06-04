import { useTranslations } from "next-intl";
import OneAnalytics from "../oneanalytics";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from "recharts";

export default function OverChart(props) {
  const t = useTranslations("OverviewChart");
  let statistics = props.statistics;

  const colors = [
    "#3b82f6",
    "#22c55e",
    "#eab308",
    "#ef4444",
    "#f97316",
    "#6b7280"
  ];

  if (
    !props.data ||
    props.data.length === 0 ||
    !props.data[0] ||
    (Object.keys(props.data[0]).length === 1 &&
      props.data[0].hasOwnProperty("name"))
  ) {
    // Manejar el caso en que los datos no estén disponibles
    return <div className="w-full h-96 p-4 bg-surface animate-pulse" />;
  }
  let categories = Object.keys(props.data[0]).filter(key => key !== "name");

  let data = [
    {
      name: "EIT171",
      entropy: Object.values(props.data[0]).slice(1)[0]
    },
    {
      name: "EIT195",
      entropy: Object.values(props.data[0]).slice(1)[1]
    },
    {
      name: "EIT284",
      entropy: Object.values(props.data[0]).slice(1)[2]
    },
    {
      name: "EIT304",
      entropy: Object.values(props.data[0]).slice(1)[3]
    },
    {
      name: "HMIIGR",
      entropy: Object.values(props.data[0]).slice(1)[4]
    },
    {
      name: "HMIMAG",
      entropy: Object.values(props.data[0]).slice(1)[5]
    }
  ];

  return (
    <div className="w-full h-fit rounded-2xl border border-surface bg-background dark:bg-background-dark dark:border-surface-dark p-4 mt-2">
      {/* Text for the chart */}
      <div
        id="chartTitlesContainer"
        className="w-fit min-h-[9vh] overflow-hidden"
      >
        <h2
          className="font-semibold text-xl text-on-background dark:text-on-background-dark"
          style={{ fontFamily: "Clash, open sans" }}
        >
          {t(`${props.parameter}Title`)}
        </h2>
        <p
          style={{ fontFamily: "Archivo" }}
          className="text-base text-on-background/80 dark:text-on-background-dark overflow-hidden"
        >
          {t(`${props.parameter}Description`)}
        </p>
      </div>

      {/* Chart */}
      <div className="flex flex-col md:flex-col xl:flex-row pt-6 gap-2 w-full h-fit">
        <div id={"barChartContainer"} className={"h-[40svh] md:h-[40svh] lg:min-h-[40svh] xl:w-2/3 xl:h-96 xl:min-h-96"}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart width={500} height={300} data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis width={20}/>
              <Tooltip />
              <Bar dataKey="entropy" fill="#191c1e">
                {data.map((entry, index) =>
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                )}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <OneAnalytics statistics={statistics} />
      </div>
    </div>
  );
}
