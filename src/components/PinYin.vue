<template>
  <div class="vue-city-picker" @mouseout="endChoice" @mouseover="startMouseOver">
    <input
      type="text"
      autocomplete="off"
      disableautocomplete
      :name="field"
      :id="field"
      :value="currCityName"
      :placeholder="placeholder"
      @focus="startChoice"
      @keypress="startChoice"
      @blur="endChoice"
      ref="input"
      class="c-input"
      :readonly="!showSearch"
      @input="handleChange"
    >
    <!--城市选择-->
    <div class="vcp-panel" v-show="cityPanelIsShow">
      <div v-if="searchValue">
        <ul class="search-list">
          <li
            v-for="item in searchList"
            :key="item.code"
            class="search-item"
            @click="choiceCity(item)"
          >{{item.name}}</li>
        </ul>
        <p v-show="searchList.length === 0">not found</p>
      </div>
      <div v-else>
        <h5>城市选择</h5>
        <ul class="vcp-tags">
          <li
            :class="{'z-on': item === tagKey}"
            v-for="item in tagsArr"
            @click="choiceTag(item)"
            :key="item"
          >{{ item }}</li>
        </ul>
        <div class="vcp-list">
          <div
            :class="{'z-hot': initial === 'hot'}"
            v-for="(citys, initial) in cityList"
            v-show="currTagIncludes(initial)"
            :key="initial"
          >
            <h6 v-if="initial != 'hot'">{{ initial }}</h6>
            <ul>
              <li
                v-for="v in citys"
                @click="choiceCity(v)"
                :title="v.name"
                :key="v.code"
              >{{ v.name }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  model: {
    prop: "value",
    event: "change"
  },
  props: {
    field: {
      type: String,
      default: ""
    },
    value: {
      type: String,
      default: ""
    },
    placeholder: {
      type: String,
      default: ""
    },
    // 城市列表
    cityList: {
      type: Object,
      default: function() {
        return window.CITY_PICKER_LIST || {};
      }
    },
    // 没有热门城市
    noHot: {
      type: Boolean,
      default: true
    },
    showSearch: {
      type: Boolean,
      default: false
    }
  },
  data() {
    let tagsArr = ["热门", "ABCDE", "FGHJ", "KLMN", "PQRST", "WXYZ"];
    let tagKey = "热门";
    const tags = {};

    if (this.noHot) {
      tagsArr = ["ABCD", "EFGH", "JKL", "MNPQ", "RSTW", "XYZ"];
      tagKey = "ABCD";
    }

    tagsArr.forEach(item => {
      tags[item] = item === "热门" ? ["hot"] : item.split("");
    });

    const cityName = this.findCity(this.value);

    return {
      cityPanelIsShow: false,
      isMouseOver: false,
      tagsArr,
      tags,
      tagKey,
      currCityName: cityName ? cityName.name : "",
      searchValue: "",
      searchList: []
    };
  },
  watch: {
    value() {
      const city = this.findCity(this.value);
      this.currCityName = city ? city.name : "";
    },
    cityPanelIsShow() {
      console.log(this.searchValue);
      if (this.searchValue) {
        this.searchValue = "";
        this.currCityName = "";
      }
    }
  },
  computed: {
    currTag() {
      const { tagKey, tags } = this;
      return tags[tagKey];
    }
  },
  methods: {
    findCity(value) {
      return Object.values(this.cityList)
        .flat()
        .find(item => item.code === value || item.name === value);
    },
    // 列表是否属于当前标签
    currTagIncludes(ini) {
      const { currTag } = this;
      return currTag.includes(ini);
    },
    // 选择标签
    choiceTag(key) {
      this.tagKey = key;
    },
    // 开始城市选择
    startChoice(e) {
      // if (e && e.type === "keypress") {
      //   e.returnValue = false;
      // }
      this.cityPanelIsShow = true;
    },
    choiceCity(options) {
      this.searchValue = "";
      this.$emit("change", options.code, options);
      this.currCityName = options.name;
      this.immEndChoice();
    },
    // 鼠标离开城市选择区域时超过一定时间，关闭城市面板
    endChoice(e) {
      const that = this;
      const inputEle = that.$refs.input;
      if (e.type === "mouseout") {
        that.isMouseOver = false;
      }
      setTimeout(function() {
        if (!that.isMouseOver && inputEle !== document.activeElement) {
          this.searchValue = "";
          that.cityPanelIsShow = false;
        }
      }, 300);
    },
    startMouseOver() {
      this.isMouseOver = true;
    },
    // 立即关闭城市面板
    immEndChoice() {
      this.cityPanelIsShow = false;
      this.isMouseOver = true;
    },
    handleChange(e) {
      this.searchValue = e.srcElement.value;
      this.currCityName = e.srcElement.value;
      this.searchAction();
    },
    searchAction() {
      this.searchList = Object.values(this.cityList)
        .flat()
        .filter(
          item =>
            item.name.indexOf(this.searchValue) > -1 ||
            item.pinyin.toLowerCase().indexOf(this.searchValue.toLowerCase()) >
              -1
        );
    }
  }
};
</script>
<style lang="less" scoped>
@base: #DDD;
@base2: #f2f2f3;
@color: #2878ff;

@keyframes vueCityPicker {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

.vue-city-picker {
  position: relative;
  margin: 0;
  font: 14/1.2 "Microsoft YaHei", tahoma, arial, "Hiragino Sans GB",
    "\\5b8b\4f53", sans-serif;
  color: #555;

  .vcp-panel {
    position: absolute;
    z-index: 99999;
    left: 0;
    padding: 12px 10px 0;
    width: 360px;
    border: 1px solid @base;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.18);
    overflow: hidden;
    background-color: #FFF;
    animation: vueCityPicker 0.1s ease-out;

    h5 {
      margin-top: 0;
      margin-bottom: 5px;
      padding-left: 2px;
      color: #aaa;
      line-height: 1.5;
      font-weight: normal;
    }

    .vcp-tags {
      overflow: hidden;
      margin: 5px 0;

      li {
        box-sizing: border-box;
        width: 60px;
        line-height: 20px;
        display: block;
        float: left;
        background-color: @base2;
        text-align: center;
        border-left: 1px solid #fff;
        cursor: pointer;

        &:first-child {
          border-left: none;
        }

        &:hover {
          color: @color;
        }

        &.z-on {
          background-color: @color;
          color: #fff;
        }
      }
    }

    .vcp-list {
      overflow: auto;
      border-bottom: 10px solid #fff;
      max-height: 300px;

      > div {
        margin: 1px 0 -1px;
        padding: 5px 0;
        line-height: 24px;
        border-bottom: 1px dashed #eee;
        overflow: hidden;

        h6 {
          float: left;
          font-weight: normal;
          color: @color;
          font-size: 13px;
          width: 30px;
          padding-left: 5px;
        }

        ul {
          overflow: hidden;

          li {
            float: left;
            width: 60px;
            padding-left: 4px;
            cursor: pointer;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;

            &:hover {
              background-color: @base2;
              color: @color;
            }
          }
        }

        &.z-hot {
          padding-left: 10px;

          ul {
            li {
              padding-left: 6px;
            }
          }
        }
      }
    }

    .search-list {
      max-height: 300px;
      overflow: auto;
    }

    .search-item {
      padding: 4px 11px;
      cursor: pointer;
      &:hover {
        background: @color;
        color: white;
      }
    }
  }
}
</style>
