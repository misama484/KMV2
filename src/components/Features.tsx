import React from 'react';

import config from '../config/index.json';

const Features = () => {
  const { features } = config;
  const { title, subtitle, description, items: featuresList } = features;
  return (
    <div className={`py-12 bg-background`} id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2
            className={`text-base text-primary font-semibold tracking-wide uppercase`}
          >
            {title}
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            {subtitle}
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-600 lg:mx-auto">
            {description}
          </p>
        </div>

        <div className="mt-10">
          <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10 ">
            {featuresList.map((feature) => (
              <div key={feature.name} className="relative">
                <div className="flex flex-col justify-center items-center">
                  <div
                    className={`flex items-center justify-center h-42 w-42 rounded-md bg-background text-tertiary border-primary border-4`}
                  >
                    <img
                      className={`h-full w-full rounded-md object-cover`}
                      src={feature.icon}
                      alt={feature.name}
                    />
                  </div>
                  <p className="text-lg mt-4 leading-6 font-medium text-gray-900">
                    {feature.name}
                  </p>
                </div>
                <p className="mt-2 text-base text-gray-700">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
