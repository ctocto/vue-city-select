<template>
  <div id="app">
    <div class="grid-item">
      <h3>拼音选择城市</h3>
      <h4>选择了：{{city}}</h4>
      <p>基本用法</p>
      <PinYin :cityList="cityData" placeholder="请选择" v-model="city"/>
      <p>可以搜索</p>
      <PinYin :cityList="cityData" placeholder="请选择" :showSearch="true"/>
      <p>默认值code</p>
      <PinYin :cityList="cityData" placeholder="请选择" :value="'230125'"/>
      <p>默认值name</p>
      <PinYin :cityList="cityData" placeholder="请选择" :value="'北京'"/>
      <p></p>
    </div>
    <div class="grid-item">
      <h3>级联选择城市</h3>
      <h4>选择了：{{city2}}</h4>
      <p>基本用法</p>
      <CityCascader placeholder="请选择" v-model="city2"/>
      <p>选择即改变</p>
      <CityCascader :changeOnSelect="true"/>
      <p>4级地址</p>
      <CityCascader :level="4" :options="division"/>
      <p>默认值code</p>
      <CityCascader :value="[ '13', '1307', '130722' ]" />
      <p>默认值name</p>
      <CityCascader :value="[ '湖北省', '荆门市', '沙洋县' ]" />
    </div>
  </div>
</template>

<script>
import PinYin from "./components/PinYin";
import CityCascader from "./components/Cascader";
import cityData from "./utils/china-city-pinyin-data.json";
import { divisionFour as division } from "./utils/util";

export default {
  name: "App",
  components: {
    PinYin,
    CityCascader
  },
  data() {
    return {
      cityData,
      division,
      city: "",
      city2: []
    };
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 30px;
  min-height: 2000px;
  display: flex;
}
.grid-item {
  flex: 1;
  padding: 8px;
}
input.c-input {
  font-variant: tabular-nums;
  list-style: none;
  -webkit-font-feature-settings: "tnum";
  font-feature-settings: "tnum";
  position: relative;
  display: inline-block;
  width: 100%;
  height: 32px;
  padding: 4px 11px;
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  line-height: 1.5;
  background-color: #fff;
  background-image: none;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
}
ul,
li {
  margin: 0;
  padding: 0;
  list-style: none;
}
input {
  outline: none;
  box-sizing: border-box;
  cursor: pointer;
}
</style>
