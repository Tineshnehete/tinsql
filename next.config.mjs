/** @type {import('next').NextConfig} */
const nextConfig = {
   output: "export",
    
    webpack: (config, { isServer }) => {
        if (!isServer) {
          config.resolve.fallback = {
            fs: false,
          };

          
        }

        config.module.rules.push({
          test: /\.wasm$/,
          type: "webassembly/async",
        });
        config.experiments = { topLevelAwait: true ,syncWebAssembly:true, asyncWebAssembly: true, layers: true};
        config.output.webassemblyModuleFilename = 'static/wasm/[modulehash].wasm';
        return config;
      },
};

export default nextConfig;
