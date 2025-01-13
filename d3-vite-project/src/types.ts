export interface Country {
  countryName: string;
  year: number;
  lifeLadder: number;
  gpdPerCapita: number;
  socialSupport: number;
  healthyLifeExpectancyAtBirth: number;
  freedomToMakeLifeChoices: number;
  generosity: number;
  corruption: number;
  positiveAffect: number;
  negativeAffect: number;
  continent: string;
  gpdPerCapita_z: number;
  socialSupport_z: number;
  healthyLifeExpectancyAtBirth_z: number;
  freedomToMakeLifeChoices_z: number;
  generosity_z: number;
  corruption_z: number;
  pca1: number;
  pca2: number;
}

export interface SelectedCountry {
  countryName: string;
  year: number;
}
