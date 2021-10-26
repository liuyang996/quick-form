<template>
  <div class="drag-wrapper">
    <p>拖拽示例</p>
    <div class="drag">
      <ul @drop="drop" @dragover="dragover"></ul>
    </div>
    <div class="drag">
      <ul @drop="drop" @dragover="dragover" class="drag-ul">
        <li v-for="i in 5" @dragstart="dragstart" :draggable="true" :id="i">
          我是一个list-item- {{ i }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  monted() {
    /**
     * 思路
     *
     *
     */
  },
  methods: {
    dragover(ev) {
      ev.preventDefault();
      // console.log("dragover-", ev);
    },
    drop(ev) {
      ev.preventDefault();

      var data = ev.dataTransfer.getData("Text");
      console.log("drop---", ev);
      console.log(data);
      if (ev.target.nodeName === "LI") {
        document
          .querySelector(".drag-ul")
          .insertBefore(
            document.getElementById(data),
            document.getElementById(ev.target.id)
          );

        return;
      }
      ev.target.appendChild(document.getElementById(data));
    },
    dragstart(ev) {
      console.log("dragstart-ev", ev);
      ev.dataTransfer.setData("Text", ev.target.id);
    }
  }
};
</script>

<style lang="scss" scope>
.drag {
  ul {
    width: 300px;
    padding: 20px;
    margin: 20px auto;
    border: 1px solid #333;
    height: 400px;
    li {
      margin-bottom: 10px;
      border: 1px solid #333;
      border-radius: 4px;
      height: 32px;
      line-height: 32px;
    }
  }
}
</style>
