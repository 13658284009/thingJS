/*
* 说明：本文件是“项目离线部署包”场景打包配置文件。
* 提示：项目离线部署包打包时将参考本文件配置进行。为确保打包完整，请将项目引入的“园区”场景URL、
*       模型URL，填写到下方的配置中。
*/
{
    // 当前项目使用的ThingJS包（thing.min.js）版本号
    "thingjs_version" : "1.2.7.24",
    // 提示：项目中引用的场景URL, 为能正确打包上述场景，需手动配置：
    "scenes":  ["/api/scene/production_170344"],
    // 提示：项目中动态引用了模型, 为能正确打包该引用模型，需手动配置：
    "models": ["/api/models/7bfb3321557a40fead822d7285ac5324/0/gltf/"]
}