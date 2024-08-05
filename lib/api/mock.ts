export class API {
  public static uploadImage = async () => {
    await new Promise((r) => setTimeout(r, 500))
    return 'https://images.ctfassets.net/5965pury2lcm/1OVj4PfkzVc4Vrm3IuDdAP/f415d995e5a286ddb2644cabafeb9578/UiPath-og-image-orange.png'
  }
}

export default API
