<template>
  <div
    class="cascader-division"
    @mouseover="showCleanIcon"
    @mouseout="hideCleanIcon"
  >
    <input
      class="c-input"
      autocomplete="off"
      disableautocomplete
      @focus="handleStartChoice"
      @keypress="handleStartChoice"
      @blur="handleEndChoice"
      :value="showText"
      ref="input"
      :placeholder="placeholder"
    >
    <div class="popup" v-show="visible" @mousedown="handleDown">
      <div class="city-tab">
        <ul>
          <li
            v-for="(item, index) in menu"
            :key="item.value"
            @click="handleMenuClick(item, index)"
            :class="{active: menuActive === index}"
          >{{item.label}}</li>
        </ul>
      </div>
      <div class="city-item">
        <div
          v-for="(item, index) in selectedOptions"
          :key="item.code"
          v-show="menuActive === index"
        >
          <ul>
            <li
              v-for="child in item"
              :key="child.code"
              :title="child.name"
              class="value"
              @click="handleChoiceValue(index, child)"
              :class="{active: child.code === selectValue[index]}"
            >{{child.name}}</li>
          </ul>
        </div>
      </div>
    </div>
    <i class="close-icon" v-show="allowClear && isShowCleanIcon" @click="cleanChoice">
      <svg viewBox="64 64 896 896" data-icon="close-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" class=""><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 0 1-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z"></path></svg>
    </i>
  </div>
</template>
<script>
import { divisionThree as division, filterDivision } from "../utils/util";

const defaultMenuActive = 0;
export default {
  name: "Cascader",
  model: {
    prop: "value",
    event: "change"
  },
  props: {
    value: {
      type: Array,
      default: undefined
    },
    changeOnSelect: Boolean,
    placeholder: String,
    level: {
      type: Number,
      default: 3
    },
    menu: {
      type: Array,
      default() {
        return [
          {
            label: "省",
            value: "province"
          },
          {
            label: "市",
            value: "city"
          },
          {
            label: "区",
            value: "area"
          },
          {
            label: "街",
            value: "street"
          }
        ];
      }
    },
    options: {
      type: Array,
      default() {
        return division;
      }
    },
    allowClear: {
      type: Boolean,
      default: true
    }
  },
  data() {
    const filterData = filterDivision(this.value, this.options);
    return {
      menuActive: defaultMenuActive,
      selected: this.value && this.value.length ? filterData.selected : [],
      visible: false,
      selectedOptions: this.value && this.value.length ? filterData.selectedOptions : [this.options],
      isShowCleanIcon: false,
    };
  },
  computed: {
    showText() {
      return this.selected.map(item => item.name).join("/");
    },
    selectValue() {
      return this.selected.map(item => item.code);
    }
  },
  watch: {
    value(val) {
      if (val) {
        const filterData = filterDivision(this.value, this.options);
        this.selected = filterData.selected;
        this.selectedOptions = filterData.selectedOptions;
      }
    }
  },
  created() {
    this.menu.length = this.level;
  },
  methods: {
    // 切换级联
    handleMenuClick({ value }, index) {
      if (index <= this.selected.length) {
        this.menuActive = index;
      }
    },
    handleStartChoice() {
      this.visible = true;
    },
    handleEndChoice() {
      this.visible = false;
      this.$refs.input.blur();
      if (!this.changeOnSelect && this.selected.length !== this.level) {
        this.cleanChoice();
      } else {
        this.$emit("change", this.selectValue, this.selected);
      }
    },
    handleDown(e) {
      e.preventDefault();
    },
    handleChoiceValue(menuIndex, data) {
      const { children, ...selected } = data;
      const nextIndex = menuIndex + 1;
      this.selected.length = menuIndex;
      this.selected.push(selected);

      if (menuIndex < this.menu.length - 1 && children) {
        this.selectedOptions[nextIndex] = children;
        this.menuActive = nextIndex;
      } else if (menuIndex === this.menu.length - 1) {
        this.handleEndChoice();
      }
    },
    cleanChoice() {
      this.menuActive = defaultMenuActive;
      this.selected = [];
    },
    showCleanIcon() {
      if (this.selected.length) {
        this.isShowCleanIcon = true;
      }
    },
    hideCleanIcon() {
      this.isShowCleanIcon = false;
    }
  }
};
</script>
<style lang="less" scoped>
@primary-color: #1890ff;
ul {
  display: flex;
  flex-wrap: wrap;
}
li {
  width: 50px;
  padding: 5px 8px;
  overflow: hidden;

  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  cursor: pointer;
}
.city-tab {
  li {
    font-weight: 600;
  }
}
.value {
  &:hover {
    background: @primary-color;
    color: #ffffff;
  }
}
.city-tab {
  .active {
    color: @primary-color;
  }
}
.city-item {
  .active {
    background: @primary-color;
    color: #ffffff;
  }
}

.cascader-division {
  position: relative;

  .popup {
    width: 330px;
    position: absolute;
    left: 0;
    z-index: 99999;
    padding: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
    border-radius: 4px;
    background: #ffffff;
  }

  .close-icon {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 12px;
    height: 12px;
    color: rgba(0,0,0,0.25);
    line-height: 12px;
    text-align: center;
    border-radius: 50%;
    font-size: 12px;
    cursor: pointer;

    &:hover {
      color: rgba(0,0,0,0.45)
    }
  }
}
</style>

