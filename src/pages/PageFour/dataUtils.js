import d from './blockWorld.js';

function getAllBlocks() {
    const stages = d.visualStages;

    const blocks = stages.map(stage => {
        return stage.visualSprites.filter(s => s.prefabimage === "img-block");
    })

    return blocks;
}

function getClaw() {
    return d.visualStages[0].visualSprites.filter(s => s.prefabimage === "img-claw");
}

function getSteps() {
    return d.visualStages.map((s =>s.stageName));
}

function getStepInfo() {
    return d.visualStages.map((s =>s.stageInfo));
}

function getSubGoal() {
    let map = new Map();
    const subgoal = d.subgoalMap.m_values;
    const step = d.subgoalMap.m_keys;
    subgoal.map((subgoalList, i) => {
        const currentStep = subgoalList[subgoalList.length-1];
        if (!map.has(currentStep)) {
            map.set(currentStep, step.slice(i))
        }
    })
    return map;
}
export const allBlocks = getAllBlocks();
export const claw = getClaw();
export const steps = getSteps();
export const stepInfo =  getStepInfo();
export const subGoal = getSubGoal();

//export default null;

