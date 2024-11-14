// 首先定义Service类型，用于处理实际请求并返回数据的函数类型
type Service<TData, TParams extends any[]> = (...params: TParams) => Promise<TData>;
type Fn<TData, TParams extends any[]> = (options: Options<TData, TParams>) => Promise<Options<TData, TParams>>;

type Options<TData, TParams extends any[]>= {
  params?: TParams;
  data?: TData;
  error?: Error;
}
// 定义Plugin类型，描述插件可能具有的各个生命周期钩子函数的类型
type Plugin<TData, TParams extends any[]> = {
    onBefore?: Fn<TData, TParams>;
    onRequest?: Fn<TData, TParams>;
    onError?:  Fn<TData, TParams>;
    onFinally?:  Fn<TData, TParams>;
    onCancel?: Fn<TData, TParams>;
};

// 定义PluginManager类来封装插件相关的功能
class PluginManager<TData, TParams extends any[]> {
    private plugins: Plugin<TData, TParams>[] = [];
    // 注册插件的方法
    public registerPlugin(plugin: Plugin<TData, TParams>): void {
      this.plugins.push(plugin);
    }
    
    // 删除插件的方法
    public removePlugin(pluginToRemove: Plugin<TData, TParams>): void {
        this.plugins = this.plugins.filter((plugin) => plugin!== pluginToRemove);
    }

    // 获取已注册插件列表的方法
    public getRegisteredPlugins(): Plugin<TData, TParams>[] {
        return this.plugins;
    }

    // 执行指定插件钩子方法的通用方法
  private async execute<T>(name: keyof Plugin<TData, TParams>,options:Options<TData, TParams> ) {
       this.plugins.map((plugin) => plugin?.[name]?.(options)).filter(Boolean);
    }

}