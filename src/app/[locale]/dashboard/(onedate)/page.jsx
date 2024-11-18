"use client";

import { useState, useEffect, Suspense } from "react";
import { useGSAP } from "@gsap/react";
import { useTranslations } from "next-intl";
import { DatePicker } from "@/components/dashboard/datepicker";
import { DetailsPanel } from "@/components/dashboard/detailspanel";
import SunImage from "@/components/dashboard/sunimage";
import gsap from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import { toast } from "sonner";
gsap.registerPlugin(TextPlugin);

const Page = () => {
  const defaultDate = new Date("2023-01-25T05:00:00.000Z");
  const [selectedDate, setSelectedDate] = useState(defaultDate);
  const [fixedDate, setFixedDate] = useState("2023-01-25");
  const [data, setData] = useState(null);
  const t = useTranslations("OneDate");

  // Defining the function to get the url of the image
  const getImage = (table, date) => {
    if (!table || !date) return ""; // Handle cases where either table or date is null

    for (let i = 0; i < table.rows.length; i++) {
      let dateObj = table.rows[i].date.split(" ")[0];
      if (dateObj === date) {
        return table.rows[i].url;
      }
    }
    return "";
  };

  // Date handling functions
  const handleDateChange = date => setSelectedDate(date);
  const fixDate = date =>
    date &&
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;

  // Fetch data from API or cache
  useEffect(
    () => {
      const fetchData = async () => {
        try {
          if (selectedDate) {
            const cachedData = localStorage.getItem("cachedData");
            if (cachedData) {
              const parsedData = JSON.parse(cachedData);
              const cachedDate = new Date(parsedData.date);
              const currentDate = new Date(selectedDate);
              if (
                currentDate.getMonth() === cachedDate.getMonth() &&
                currentDate.getFullYear() === cachedDate.getFullYear()
              ) {
                setData(parsedData.data);
                return;
              }
            }

            const response = await fetch(
              `https://lumaweb-api-container.azurewebsites.net/api/get-data?date=${fixDate(selectedDate)}`
            );
            const result = await response.json();
            let dataFound = false;
            for (const key in result) {
              if (result[key].rows.length === 0) {
                toast(
                  "No data available for this date. Please select another date."
                );
              } else {
                dataFound = true;
              }
            }

            if (dataFound) {
              toast("Data fetched successfully!");
            }
            setData(result);

            // Cache the data for this month
            localStorage.setItem(
              "cachedData",
              JSON.stringify({ date: selectedDate, data: result })
            );
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
      setFixedDate(fixDate(selectedDate));
    },
    [selectedDate]
  );

  // Animation with GSAP
  useEffect(() => {
    const tl = gsap.timeline();
    tl
      .to("#titleOneDate", { text: t("title"), duration: 0.6 })
      .to("#subtitleOneDate", { text: `Estadisticos solares para la fecha: ${fixedDate}`, duration: 0.5 })
      .to("#oneDatePicker", {
        x: 0,
        opacity: 100,
        duration: 0.5,
        ease: "expo.out"
      });

    [
      "eit171",
      "eit195",
      "eit284",
      "eit304",
      "eithmiigr",
      "hmimag"
    ].forEach((csun, index) => {
      gsap.to(`.${csun}`, {
        y: 0,
        duration: 0.5 + index * 0.1,
        ease: "back.inOut(1.7)"
      });
    });
  }, [fixedDate]);

  // Rendering components
  return (
    <div className="w-full h-fit flex flex-col md:p-2">
      {/* Header */}
      <div
        id="nav"
        className="w-full min-h-[7vh] font-semibold flex flex-col mb-4 md:flex-row md:justify-between md:items-center"
      >
        <div id="titleContainer">
          <h1
            id="titleOneDate"
            className="text-3xl text-on-background dark:text-on-background-dark"
          />
          <h2
            id="subtitleOneDate"
            className="text-base font-normal text-on-background dark:text-on-background-dark"
            style={{ fontFamily: "Archivo" }}
          />
        </div>
        <div id="dateContainer" className="flex mt-2 md:mt-0">
          <DatePicker onDateChange={handleDateChange} />
        </div>
      </div>

      {/* Sun images */}
      <div
        id="sunImagesContainer"
        className="scrollable w-full h-fit flex gap-4 xl:gap-2 justify-between pt-4 border-t border-outline overflow-x-scroll 2xl:overflow-hidden z-20"
      >
        <div id="eitContainer" className="flex gap-4 xl:gap-2">
          {["171", "195", "284", "304"].map(table =>
            <SunImage
              key={table}
              csun={`eit${table}`}
              table={`eit${table}`}
              image={
                data && data[`data${table}`]
                  ? getImage(data[`data${table}`], fixDate(selectedDate))
                  : ""
              }
              description={t(`description${table}`)}
            />
          )}
        </div>
        <div id="hmiContainer" className="flex gap-4 xl:gap-2">
          <SunImage
            csun="eithmiigr"
            table="hmiigr"
            image={
              data && data.datahmiigr
                ? getImage(data.datahmiigr, fixDate(selectedDate))
                : ""
            }
            description={t("descriptionIgr")}
          />
          <SunImage
            csun="hmimag"
            table="hmimag"
            image={
              data && data.datahmimag
                ? getImage(data.datahmimag, fixDate(selectedDate))
                : ""
            }
            description={t("descriptionMag")}
          />
        </div>
      </div>

      {/* Details panel */}
      <div className="h-fit">
        <DetailsPanel data={data} date={fixDate(selectedDate)} />
      </div>
    </div>
  );
};

export default Page;
