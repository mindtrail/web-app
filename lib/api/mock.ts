const env = process.env.NODE_ENV

const SCRAPER_SERVICE_URL = 'http://localhost:80'

export class API {
  public static uploadImage = async () => {
    await new Promise((r) => setTimeout(r, 500))

    return 'https://images.ctfassets.net/5965pury2lcm/1OVj4PfkzVc4Vrm3IuDdAP/f415d995e5a286ddb2644cabafeb9578/UiPath-og-image-orange.png'
  }

  public static scrapeURL = async (url: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API delay
    return `Teleport HQ - Create. Code. Publish. Together.
      TeleportHQ is the collaborative front-end platform with AI capabilities and headless content management system integrations. A powerful visual builder to create and publish your static and dynamic websites instantly.

      How it works.
      Create stunning static websites and UI elements,
      through a seamless workflow
      Integrate an advanced developer-centric front-end design system that works with any workflow.
      Enable seamless collaboration between designers and developers.
    `
  }
}

export default API
