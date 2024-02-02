import { useTranslations } from "next-intl";
import {
  AreaChart,
  BarChart,
  Card,
  Flex,
  Subtitle,
  Title
} from "@tremor/react";

export default function OverChart(props) {
  const t = useTranslations("OverviewChart");

  const colors = [
    "blue",
    "green",
    "yellow",
    "red",
    "orange",
    "gray"
  ]

  if (!props.data || props.data.length === 0 || !props.data[0]) {
    // Manejar el caso en que los datos no estén disponibles
    return null;
  }
  
  let categories = Object.keys(props.data[0]).filter(key => key !== 'name');

  return (
    <Card className="w-full rounded-sm bg-background dark:bg-background-dark p-2">
      <Title style={{fontFamily: 'Clash'}} >{t(`${props.parameter}Title`)}</Title>
      <Subtitle style={{fontFamily: 'Archivo'}} className="text-on-background/80 dark:text-on-background-dark/80 md:max-w-[60vw]">
        {t(`${props.parameter}Description`)}
      </Subtitle>
      <BarChart
        className="w-2/3 mt-6 border border-surface dark:border-surface-dark rounded-md"
        data={props.data}
        index="name"
        categories={categories}
        colors={colors} // color hexadecimal para 'primary'
        tickGap={7}
        showAnimation={true}
        yAxisWidth={48}
        enableLegendSlider={true}
      />
    </Card>
  );
}
