<script>
import Moveable from "vue3-moveable";
import Selecto from "vue3-selecto";
import { ref } from "vue";

export default {
    components: { Moveable, Selecto },
    setup() {
        const moveableRef = ref(null);
        const targets = ref([]);
        // const onClick = () => {
        //     const rect = moveableRef.value.getRect();
        //     const moveables = moveableRef.value.getMoveables();
        //     if (moveables.length <= 1) {
        //         return;
        //     }
        //     moveables.forEach(child => {
        //         child.request("draggable", { y: rect.top }, true);
        //     });
        //     moveableRef.value?.updateRect();
        // };
        // const onClick$0 = () => {
        //     const rect = moveableRef.value.getRect();
        //     const moveables = moveableRef.value.getMoveables();
        //     if (moveables.length <= 1) {
        //         return;
        //     }
        //     moveables.forEach(child => {
        //         child.request("draggable", {
        //             y: rect.top + rect.height
        //         }, true);
        //     });
        //     moveableRef.value?.updateRect();
        // };
        // const onClick$1 = () => {
        //     const rect = moveableRef.value.getRect();
        //     const moveables = moveableRef.value.getMoveables();
        //     if (moveables.length <= 1) {
        //         return;
        //     }
        //     moveables.forEach(child => {
        //         child.request("draggable", { x: rect.left }, true);
        //     });
        //     moveableRef.value?.updateRect();
        // };
        // const onClick$2 = () => {
        //     const rect = moveableRef.value.getRect();
        //     const moveables = moveableRef.value.getMoveables();
        //     if (moveables.length <= 1) {
        //         return;
        //     }
        //     moveables.forEach(child => {
        //         child.request("draggable", {
        //             y: rect.left + rect.width
        //         }, true);
        //     });
        //     moveableRef.value?.updateRect();
        // };
        // const onClick$3 = () => {
        //     const rect = moveableRef.value.getRect();
        //     const moveables = moveableRef.value.getMoveables();
        //     if (moveables.length <= 1) {
        //         return;
        //     }
        //     moveables.forEach((child, i) => {
        //         child.request("draggable", {
        //             y: rect.top + rect.height / 2 - rect.children[i].height / 2
        //         }, true);
        //     });
        //     moveableRef.value?.updateRect();
        // };
        // const onClick$4 = () => {
        //     const rect = moveableRef.value.getRect();
        //     const moveables = moveableRef.value.getMoveables();
        //     if (moveables.length <= 1) {
        //         return;
        //     }
        //     moveables.forEach((child, i) => {
        //         child.request("draggable", {
        //             x: rect.left + rect.width / 2 - rect.children[i].width / 2
        //         }, true);
        //     });
        //     moveableRef.value?.updateRect();
        // };
        // const onClick$5 = () => {
        //     const groupRect = moveableRef.value.getRect();
        //     const moveables = moveableRef.value.getMoveables();
        //     let top = groupRect.top;
        //     if (moveables.length <= 1) {
        //         return;
        //     }
        //     const gap = (groupRect.height - groupRect.children.reduce(
        //         (prev, cur) => {
        //             return prev + cur.height;
        //         },
        //         0
        //     )) / (moveables.length - 1);
        //     moveables.sort((a, b) => {
        //         return a.state.top - b.state.top;
        //     });
        //     moveables.forEach(child => {
        //         const rect = child.getRect();
        //         child.request("draggable", { y: top }, true);
        //         top += rect.height + gap;
        //     });
        //     moveableRef.value?.updateRect();
        // };
        // const onClick$6 = () => {
        //     const groupRect = moveableRef.value.getRect();
        //     const moveables = moveableRef.value.getMoveables();
        //     let left = groupRect.left;
        //     if (moveables.length <= 1) {
        //         return;
        //     }
        //     const gap = (groupRect.width - groupRect.children.reduce(
        //         (prev, cur) => {
        //             return prev + cur.width;
        //         },
        //         0
        //     )) / (moveables.length - 1);
        //     moveables.sort((a, b) => {
        //         return a.state.left - b.state.left;
        //     });
        //     moveables.forEach(child => {
        //         const rect = child.getRect();
        //         child.request("draggable", { x: left }, true);
        //         left += rect.width + gap;
        //     });
        //     moveableRef.value?.updateRect();
        // };
        const onRender = e => {
            e.target.style.cssText += e.cssText;
        };
        const onRenderGroup = e => {
            e.events.forEach(ev => {
                ev.target.style.cssText += ev.cssText;
            });
        };
        const onDragStart = e => {
            const moveable = moveableRef.value;
            const target = e.inputEvent.target;
            if (target.tagName === "BUTTON" || moveable.isMoveableElement(target)
                || targets.value.some(t => t === target || t.contains(target))
            ) {
                e.stop();
            }
        };
        const onSelectEnd = e => {
            const moveable = moveableRef.value;
            if (e.isDragStart) {
                e.inputEvent.preventDefault();
                moveable.waitToChangeTarget().then(() => {
                    moveable.dragStart(e.inputEvent);
                });
            }
            targets.value = e.selected;
        };
        return {
            // onClick,
            // onClick$0,
            // onClick$1,
            // onClick$2,
            // onClick$3,
            // onClick$4,
            // onClick$5,
            // onClick$6,
            moveableRef,
            targets,
            onRender,
            onRenderGroup,
            window,
            onDragStart,
            onSelectEnd
        };
    }
};
</script>
<template>
    <div class="root">
        <div class="container">
            <!-- <button @click="onClick">Align Top</button>
            &nbsp;
            <button @click="onClick$0">Align Bottom</button>
            &nbsp;
            <button @click="onClick$1">Align Left</button>
            &nbsp;
            <button @click="onClick$2">Align Right</button>
            &nbsp;
            <button @click="onClick$3">Align Vertical Center</button>
            &nbsp;
            <button @click="onClick$4">Align Horizontal Center</button>
            &nbsp;
            <button @click="onClick$5">Arrange Vertical Spacing</button>
            &nbsp;
            <button @click="onClick$6">Arrange Horizontal Spacing</button>
            &nbsp; -->
            <div
                class="target target1"
                style="left: 50px;top: 150px;"
            >Target1</div>
            <div
                class="target target2"
                style="left: 250px;top: 250px;"
            >Target2</div>
            <div
                class="target target3"
                style="left: 400px;top: 300px;"
            >Target3</div>
            <Moveable
                ref="moveableRef"
                :target="targets"
                :draggable="true"
                :resizable="true"
                :snappable="true"
                :snapGridWidth="50"
                @render="onRender"
                @renderGroup="onRenderGroup"/>
            <Selecto
                :dragContainer="window"
                :selectableTargets="['.target']"
                :hitRate="0"
                :selectByClick="true"
                :selectFromInside="true"
                :toggleContinueSelect="['shift']"
                :ratio="0"
                @dragStart="onDragStart"
                @selectEnd="onSelectEnd"
            ></Selecto>
        </div>
    </div>
</template>

<style>
.container{
  position: relative;
}
.target {
  position: absolute;
  border: 1px solid green;
  width: 100px;
  height: 100px;
}
</style>