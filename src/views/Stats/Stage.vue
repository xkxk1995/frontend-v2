<template>
  <StageSelector
    :name="$t('stats.name')"
    :router-names="routerNames"
    @select="select"
  >
    <v-card class="bkop-light pt-2 elevation-4 mt-2 content-card">
      <v-card-title class="pb-0 mx-1">
        <v-row
          justify="center"
          class="px-4 px-sm-4 px-md-6 px-lg-6 px-xl-8 pt-0 pb-4 flex-column flex-sm-row align-center align-sm-end"
        >
          <div class="d-flex flex-column w-full align-self-start">
            <h2
              class="subtitle-2 d-block"
              style="width: 100%"
            >
              {{ strings.translate(zone, "zoneName") }}
            </h2>
            <h1 class="title pt-1 no-wrap--text d-inline-flex align-center">
              {{
                $t("stats.title", {stage: strings.translate(stage, "code")})
              }}
            </h1>
          </div>
          <v-spacer />
          <div class="flex text-center text-sm-right">
            <MatrixCategoryToggle />
            <DataSourceToggle />
          </div>
        </v-row>
      </v-card-title>

      <v-row
        v-if="isRecruit"
        align="center"
        justify="center"
        class="my-1 mx-2 mx-md-8"
      >
        <v-alert
          type="info"
          outlined
          border="left"
        >
          公开招募统计现处于测试阶段且暂不支持前端汇报，当前的汇报主要来自
          MaaArknightsAssistant。公开招募统计的相关 API 与内部实现将于后续优化。
        </v-alert>
      </v-row>

      <DataTable
        :items="stats"
        type="stage"
        :trends="trends"
        :is-recruit="isRecruit"
        :valid-stage="validStage"
        class="px-3 px-sm-4 px-md-6 px-lg-6 px-xl-8 pt-0 pb-6"
      />

      <BackdropName :content="strings.translate(stage, 'code')" />
    </v-card>

    <StageDetails
      :stage="stage"
      :zone="zone"
      :stats="stats"
      :valid-stage="!!validStage"
    />
  </StageSelector>
</template>

<script>
import BackdropName from "@/components/stats/BackdropName";
import DataSourceToggle from "@/components/stats/DataSourceToggle";
import DataTable from "@/components/stats/DataTable";
import StageDetails from "@/components/stats/details/StageDetails";
import StageSelector from "@/components/stats/StageSelector";
import existUtils from "@/utils/existUtils";
import get from "@/utils/getters";
import strings from "@/utils/strings";
import MatrixCategoryToggle from "../../components/stats/MatrixCategoryToggle.vue";

export default {
  name: "StatsByStage",
  components: {
    StageDetails,
    BackdropName,
    DataSourceToggle,
    DataTable,
    StageSelector,
    MatrixCategoryToggle,
  },
  data: () => ({
    expanded: {},
    selected: {
      zone: null,
      stage: null,
    },
    search: "",
    routerNames: {
      index: "StatsByStage",
      details: "StatsByStage_Selected",
    },
  }),
  computed: {
    stats() {
      const got = get.statistics.byStageId(this.selected.stage);
      if (!got) return [];
      return got;
    },
    stage() {
      const got = get.stages.byStageId(this.selected.stage);
      if (!got) return {code: ""};
      return {
        ...got,
        code: strings.translate(got, "code"),
      };
    },
    zone() {
      const got = get.zones.byZoneId(this.selected.zone, false);
      if (!got) return {};
      return {
        ...got,
        zoneName: strings.translate(got, "zoneName"),
      };
    },
    strings() {
      return strings;
    },
    getter() {
      return get;
    },
    trends() {
      return get.trends.byStageId(this.selected.stage);
    },
    validStage() {
      return (
          !this.zone.isOutdated &&
          this.stage.dropInfos &&
          existUtils.existence(this.stage, true)
      );
    },
    isRecruit() {
      return this.selected.stage === "recruit";
    },
  },
  methods: {
    select({zone, stage}) {
      this.selected.zone = zone;
      this.selected.stage = stage;
    },
  },
};
</script>

<style scoped>
.theme--light .zoneTitle {
  color: #fff;
}

.v-table {
  background: transparent !important;
}

/*.v-expansion-panel {*/
/*  transform: translateY(48px);*/
/*  opacity: 0;*/
/*}*/
</style>
